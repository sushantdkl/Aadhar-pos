"use client"

import { useState, useRef, useEffect, useId } from "react"
import Link from "next/link"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { BUSINESS_TYPES, normalizeNepalPhone, isValidEmail } from "@/lib/quote-schema"
import { cn } from "@/lib/utils"

const fieldBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 " +
  "dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"

/**
 * General enquiry form. Posts to the existing `/api/contact` route.
 * For a costed proposal the quotation form at /get-quote is the right path —
 * this is for questions that are not yet a quotation request.
 */
export default function ContactForm() {
  const [values, setValues] = useState({
    name: "", email: "", phone: "", businessType: "", message: "", consent: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("idle")
  const [serverError, setServerError] = useState("")
  const successRef = useRef(null)
  const uid = useId()

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = "Please enter your name."
    if (!isValidEmail(values.email)) next.email = "Enter a valid email address."
    if (!normalizeNepalPhone(values.phone)) next.phone = "Enter a valid Nepal number, e.g. 9801234567."
    if (values.message.trim().length < 10) next.message = "Please tell us a little more (at least 10 characters)."
    if (values.message.length > 2000) next.message = "Please keep your message under 2000 characters."
    if (!values.consent) next.consent = "Please confirm you agree to be contacted."
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === "submitting") return

    const found = validate()
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setStatus("error")
      return
    }

    setStatus("submitting")
    setServerError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          phone: normalizeNepalPhone(values.phone),
          businessType: values.businessType,
          message: values.message.trim(),
        }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        setServerError(payload.error || "We could not send your message. Please try again or call us.")
        setStatus("error")
        return
      }
      setStatus("success")
      setValues({ name: "", email: "", phone: "", businessType: "", message: "", consent: false })
    } catch {
      setServerError("We could not reach our server. Please check your connection and try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-8 text-center focus:outline-none"
      >
        <CheckCircle2 className="mx-auto mb-4 h-11 w-11 text-emerald-500" aria-hidden="true" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Message sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-slate-400">
          Thanks — we have your message and will reply during our support hours. If it is urgent, calling
          is faster.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
        >
          Send another message
        </button>
      </div>
    )
  }

  const field = (key) => cn(fieldBase, errors[key] ? "border-red-500" : "border-gray-300 dark:border-slate-700")

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <p role="alert" className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/[0.07] p-3 text-sm font-medium text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {serverError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-slate-200">
            Your name <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={field("name")}
          />
          {errors.name && (
            <p id={`${uid}-name-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-slate-200">
            Phone <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
            className={field("phone")}
            placeholder="9801234567"
          />
          {errors.phone && (
            <p id={`${uid}-phone-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-slate-200">
            Email <span className="text-orange-500" aria-hidden="true">*</span>
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={field("email")}
          />
          {errors.email && (
            <p id={`${uid}-email-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${uid}-businessType`} className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-slate-200">
            Business type
          </label>
          <select
            id={`${uid}-businessType`}
            value={values.businessType}
            onChange={set("businessType")}
            className={field("businessType")}
          >
            <option value="">Choose one…</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-slate-200">
          How can we help? <span className="text-orange-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${uid}-message`}
          rows={5}
          maxLength={2000}
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          className={cn(field("message"), "resize-y")}
          placeholder="Tell us about your business and what you are trying to solve."
        />
        {errors.message && (
          <p id={`${uid}-message-error`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${uid}-consent`}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
            errors.consent ? "border-red-500 bg-red-500/[0.05]" : "border-gray-300 dark:border-slate-700"
          )}
        >
          <input
            type="checkbox"
            id={`${uid}-consent`}
            checked={values.consent}
            onChange={set("consent")}
            aria-invalid={Boolean(errors.consent)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500 dark:border-slate-600"
          />
          <span className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
            I agree that AADHAR may contact me about this enquiry and store these details for that
            purpose, as described in the{" "}
            <Link href="/privacy" className="font-semibold text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            {errors.consent}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-slate-950 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>

      <p className="text-xs text-gray-500 dark:text-slate-500">
        Looking for a price? The{" "}
        <Link href="/get-quote" className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
          quotation form
        </Link>{" "}
        gets you a costed proposal faster.
      </p>
    </form>
  )
}
