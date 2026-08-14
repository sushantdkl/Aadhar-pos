import { NextResponse } from "next/server"
import crypto from "crypto"
import { adminDb } from "@/lib/firebase-admin"
import { validateQuote, generateReference, estimateQuote } from "@/lib/quote-schema"

/**
 * Quotation lead intake for the public website.
 *
 * Isolated from the POS product: it writes only to the `quote_requests`
 * collection and never touches restaurant, shop, licence or billing data.
 *
 * Protections: server-side re-validation, honeypot + time-trap, per-IP rate
 * limiting, and idempotent de-duplication so a retried submission returns the
 * original reference instead of creating a second lead.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/* ── rate limiting ─────────────────────────────────────────
   In-memory sliding window. On a single long-lived server this is exact; on
   serverless it is per-instance and therefore best-effort. It stops naive
   flooding — it is not a substitute for an edge WAF on a high-traffic site. */

const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }
const hits = new Map()

function rateLimited(key) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT.windowMs
  const timestamps = (hits.get(key) || []).filter((t) => t > windowStart)

  if (timestamps.length >= RATE_LIMIT.max) {
    hits.set(key, timestamps)
    return true
  }
  timestamps.push(now)
  hits.set(key, timestamps)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => t > windowStart)) hits.delete(k)
    }
  }
  return false
}

function clientKey(request) {
  const fwd = request.headers.get("x-forwarded-for")
  const ip = fwd ? fwd.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown"
  return ip
}

/** Stable hash used to collapse duplicate submissions of the same enquiry. */
function fingerprint(data) {
  return crypto
    .createHash("sha256")
    .update([data.phone, data.email, data.businessName.toLowerCase(), data.businessType].join("|"))
    .digest("hex")
    .slice(0, 32)
}

function secureReference() {
  const bytes = crypto.randomBytes(4)
  return generateReference(new Date(), (i) => bytes[i])
}

/**
 * Sends an internal notification if — and only if — email infrastructure is
 * configured via environment variables. Never throws into the request path:
 * a notification failure must not lose a lead that is already stored.
 */
async function notifyTeam(reference, data) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.QUOTE_NOTIFICATION_EMAIL
  const from = process.env.QUOTE_NOTIFICATION_FROM

  if (!apiKey || !to || !from) {
    // No email provider configured — the lead is still stored and retrievable.
    console.info(`[quote] ${reference} stored. Email notification skipped (not configured).`)
    return { sent: false, reason: "not-configured" }
  }

  const rows = [
    ["Reference", reference],
    ["Name", data.fullName],
    ["Business", data.businessName],
    ["Type", data.businessType],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Location", data.location],
    ["Outlets", data.outlets],
    ["Users", data.users],
    ["Package", data.selectedPackage || "Not selected"],
    ["Current software", data.currentSoftware || "—"],
    ["Modules", data.modules.join(", ") || "—"],
    ["Tables", data.tableCount ?? "—"],
    ["Rooms", data.roomCount ?? "—"],
    ["Products", data.productCount ?? "—"],
    ["Data migration", data.needsDataMigration ? "Yes" : "No"],
    ["Website", data.needsWebsite ? "Yes" : "No"],
    ["Online ordering", data.needsOnlineOrdering ? "Yes" : "No"],
    ["Payment integration", data.needsPaymentIntegration ? "Yes" : "No"],
    ["IRD / CBMS", data.needsIrdIntegration ? "Yes" : "No"],
    ["Hardware", data.hardware.join(", ") || "—"],
    ["Preferred install date", data.installDate || "—"],
    ["Preferred contact", data.contactMethod],
    ["Notes", data.additionalRequirements || "—"],
  ]

  const escape = (v) =>
    String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])

  const html = `<h2>New quotation request — ${escape(reference)}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="border:1px solid #ddd"><strong>${escape(k)}</strong></td><td style="border:1px solid #ddd">${escape(v)}</td></tr>`).join("")}
</table>`

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `Quote request ${reference} — ${data.businessName}`,
        html,
      }),
    })
    if (!res.ok) {
      console.error(`[quote] ${reference} notification failed: ${res.status}`)
      return { sent: false, reason: "provider-error" }
    }
    return { sent: true }
  } catch (error) {
    console.error(`[quote] ${reference} notification error:`, error.message)
    return { sent: false, reason: "network-error" }
  }
}

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 })
    }

    // ── Anti-spam: honeypot field that only a bot would fill in.
    if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
      // Respond as success so bots get no signal, but store nothing.
      return NextResponse.json({ success: true, reference: secureReference() })
    }

    // ── Anti-spam: a real person cannot complete this form in under 3 seconds.
    const elapsed = Number(body.elapsedMs)
    if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 3000) {
      return NextResponse.json(
        { error: "That was submitted unusually fast. Please try again." },
        { status: 429 }
      )
    }

    if (rateLimited(clientKey(request))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes, or call us directly." },
        { status: 429, headers: { "Retry-After": "600" } }
      )
    }

    // ── Server-side validation is authoritative.
    const { valid, errors, data } = validateQuote(body)
    if (!valid) {
      return NextResponse.json({ error: "Please correct the highlighted fields.", errors }, { status: 400 })
    }

    if (!adminDb) {
      console.error("[quote] Firestore unavailable — lead could not be stored.")
      return NextResponse.json(
        { error: "We could not submit your request right now. Please call or email us and we will take the details directly." },
        { status: 503 }
      )
    }

    const fp = fingerprint(data)
    const collection = adminDb.collection("quote_requests")

    // ── Idempotency: a retry of the same enquiry within 24h returns the
    //    original reference rather than creating a duplicate lead.
    //    Filtered on a single equality field so no composite index is needed;
    //    the recency check runs in memory over the (few) matching docs.
    const since = Date.now() - 24 * 60 * 60 * 1000
    const existing = await collection.where("fingerprint", "==", fp).limit(5).get()
    const recent = existing.docs.find((doc) => {
      const createdAt = Date.parse(doc.data().created_at)
      return Number.isFinite(createdAt) && createdAt >= since
    })

    if (recent) {
      return NextResponse.json({
        success: true,
        reference: recent.data().reference,
        duplicate: true,
        message: "We already have this request and our team will be in touch.",
      })
    }

    const reference = secureReference()
    const estimate = estimateQuote(data)
    const now = new Date().toISOString()

    await collection.add({
      ...data,
      reference,
      fingerprint: fp,
      estimate: estimate
        ? { oneTime: estimate.oneTime, monthly: estimate.monthly, hasQuoteOnly: estimate.hasQuoteOnly }
        : null,
      source: "website:get-quote",
      status: "new",
      created_at: now,
      updated_at: now,
    })

    const notification = await notifyTeam(reference, data)

    return NextResponse.json({
      success: true,
      reference,
      notified: notification.sent,
      message: "Your quotation request has been received.",
    })
  } catch (error) {
    // Never leak internals to the client.
    console.error("[quote] Unhandled error:", error)
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again, or contact us directly." },
      { status: 500 }
    )
  }
}
