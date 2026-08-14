"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Check, X, Sparkles, ArrowRight, Info } from "lucide-react"
import {
  PACKAGES, SEGMENT_LABELS, packagesBySegment, PRICING_TERMS, ADD_ONS,
} from "@/lib/content/packages"
import { npr, estimateFirstYear } from "@/lib/content/format"
import { EVALUATION } from "@/lib/content/site"
import { SectionHeading, Card, AvailabilityBadge, DisclosureNote } from "./ui"
import QuoteModal from "./quote-modal"
import { cn } from "@/lib/utils"

const SEGMENTS = ["retail", "restaurant", "hotel", "enterprise"]

/* ═══════════════ package card ═══════════════ */

function PackageCard({ pkg, index }) {
  const reduceMotion = useReducedMotion()
  const firstYear = pkg.quoteOnly ? null : estimateFirstYear({ oneTime: pkg.oneTime, monthly: pkg.monthly })

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.3) }}
      className="h-full"
    >
      <Card
        className={cn(
          "relative flex h-full flex-col p-6 sm:p-7",
          pkg.recommended &&
            "border-orange-500/50 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/20"
        )}
      >
        {pkg.recommended && (
          <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-500/30">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Recommended
          </span>
        )}

        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
        <p className="mt-1.5 text-sm text-gray-600 dark:text-slate-400">{pkg.description}</p>

        {/* Price: the two charges kept visually distinct */}
        <div className="my-6 space-y-3">
          {pkg.quoteOnly ? (
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">Custom quotation</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                Scoped after a requirements review
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-500">
                  One-time software licence
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {npr(pkg.oneTime)}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-500">
                  No annual licence renewal
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-500">
                  Hosting &amp; maintenance
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {npr(pkg.monthly)}
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-500">/month</span>
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-500">
                  Begins after the included first month
                </p>
              </div>
            </>
          )}
        </div>

        {pkg.priceNote && (
          <p className="-mt-2 mb-5 rounded-lg bg-amber-500/[0.08] px-3 py-2.5 text-[11px] leading-relaxed text-gray-700 dark:text-slate-300">
            {pkg.priceNote}
          </p>
        )}

        <Link
          href={pkg.cta.href}
          className="group mb-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          {pkg.cta.label}
          <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>

        <div className="flex-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-500">
            Included
          </p>
          <ul className="space-y-2">
            {pkg.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-slate-300">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {pkg.excludes?.length > 0 && (
            <>
              <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-500">
                Not included in this package
              </p>
              <ul className="space-y-2">
                {pkg.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-gray-400 dark:text-slate-600">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {firstYear !== null && (
          <p className="mt-6 border-t border-gray-200 pt-4 text-[11px] leading-relaxed text-gray-500 dark:border-slate-800 dark:text-slate-500">
            Indicative first-year total: <strong className="text-gray-700 dark:text-slate-300">{npr(firstYear)}</strong>{" "}
            (licence + 11 billable months). Excludes VAT, hardware and add-ons. Non-binding.
          </p>
        )}
      </Card>
    </motion.div>
  )
}

/* ═══════════════ pricing tabs ═══════════════ */

export function PricingTables({ className = "" }) {
  const [segment, setSegment] = useState("restaurant")
  const list = packagesBySegment(segment)

  return (
    <section
      className={cn("bg-white px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:py-16 lg:py-20", className)}
      aria-labelledby="pricing-heading"
      id="pricing"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="pricing-heading"
          eyebrow="Pricing"
          title="One-time licence. Monthly service. Nothing hidden."
          subtitle="You buy the software once — there is no annual licence renewal. The monthly charge covers cloud hosting, your domain, backups, maintenance and support. Every package, including the lowest, comes with a full public website for your customers and its domain. Hardware, SMS and payment-provider fees are separate."
        />

        {/* Evaluation terms */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
          <p className="text-center text-sm font-bold text-gray-900 dark:text-white">{EVALUATION.headline}</p>
          <ul className="mt-3 grid gap-1.5 text-xs text-gray-600 dark:text-slate-400 sm:grid-cols-2">
            {EVALUATION.points.map((p) => (
              <li key={p} className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Segment tabs */}
        <div
          role="tablist"
          aria-label="Pricing by industry"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {SEGMENTS.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={segment === s}
              aria-controls={`pricing-panel-${s}`}
              id={`pricing-tab-${s}`}
              onClick={() => setSegment(s)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
                segment === s
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
              )}
            >
              {SEGMENT_LABELS[s]}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`pricing-panel-${segment}`}
          aria-labelledby={`pricing-tab-${segment}`}
          className={cn(
            "mt-10 grid gap-6",
            list.length === 1 ? "mx-auto max-w-2xl" : "sm:grid-cols-2 lg:mx-auto lg:max-w-5xl"
          )}
        >
          {list.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        {segment === "enterprise" && (
          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/get-quote?package=enterprise"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
            >
              Request Enterprise Quote
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
            >
              Book Technical Demo
            </Link>
          </div>
        )}

        <DisclosureNote className="mx-auto mt-8 max-w-2xl text-center">
          All prices are in Nepalese Rupees and exclude 13% VAT. Listed prices cover one outlet unless
          stated otherwise.{" "}
          <Link href="/pricing#terms" className="font-medium text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
            Read the full pricing conditions
          </Link>
          .
        </DisclosureNote>
      </div>
    </section>
  )
}

/* ═══════════════ add-ons ═══════════════ */

export function AddOns({ className = "" }) {
  const reduceMotion = useReducedMotion()
  // Opening the quotation inline keeps the visitor in context after they have
  // just decided which add-ons they want.
  const [quoteOpen, setQuoteOpen] = useState(false)

  return (
    <section
      className={cn("bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-900/50 sm:py-16 lg:py-20", className)}
      aria-labelledby="addons-heading"
      id="add-ons"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="addons-heading"
          eyebrow="Optional Add-Ons"
          title="Extend the system only where you need it."
          subtitle="Add-ons are priced separately so you are not paying for modules your business does not use. Where a capability depends on a third party or an approval process, we say so on the card."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ADD_ONS.map((addon, i) => (
            <motion.div
              key={addon.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
              className="h-full"
            >
              <Card interactive className="flex h-full flex-col p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{addon.name}</h3>
                  <AvailabilityBadge status={addon.status} className="mt-0.5 shrink-0" />
                </div>

                <p className="text-sm text-gray-600 dark:text-slate-400">{addon.summary}</p>

                <p className="my-4 rounded-lg bg-orange-500/[0.08] px-3 py-2 text-sm font-bold text-orange-700 dark:text-orange-400">
                  {addon.priceLabel}
                </p>

                <ul className="flex-1 space-y-2">
                  {addon.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-slate-300">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                {addon.caveat && (
                  <p className="mt-4 flex items-start gap-1.5 border-t border-gray-200 pt-3 text-[11px] leading-relaxed text-gray-500 dark:border-slate-800 dark:text-slate-500">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    {addon.caveat}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Build your quotation
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <p className="mt-3 text-xs text-gray-500 dark:text-slate-500">
            Prefer a full page?{" "}
            <Link
              href="/get-quote"
              className="font-semibold text-orange-600 underline-offset-2 hover:underline dark:text-orange-400"
            >
              Open the quotation form
            </Link>
          </p>
        </div>
      </div>

      <QuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        title="Build your quotation"
      />
    </section>
  )
}

/* ═══════════════ terms ═══════════════ */

export function PricingTerms({ className = "" }) {
  return (
    <section
      id="terms"
      className={cn("scroll-mt-24 bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20", className)}
      aria-labelledby="terms-heading"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          id="terms-heading"
          eyebrow="Pricing Conditions"
          title="The conditions attached to every price on this page."
          subtitle="We would rather you read these before signing than discover them afterwards."
        />

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {PRICING_TERMS.map((term) => (
            <li
              key={term}
              className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
              {term}
            </li>
          ))}
        </ul>

        <DisclosureNote className="mt-8 text-center">
          Full commercial terms are set out in our{" "}
          <Link href="/terms" className="font-medium text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/refund-policy" className="font-medium text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
            Refund Policy
          </Link>{" "}
          and{" "}
          <Link href="/service-policy" className="font-medium text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
            Service Policy
          </Link>
          .
        </DisclosureNote>
      </div>
    </section>
  )
}

export { PACKAGES }
