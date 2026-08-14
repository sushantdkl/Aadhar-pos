"use client"

import { useState, useId } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Flag, Layers, Clock, KeyRound, Wrench, Settings2, ChevronDown, ArrowRight,
  ShieldCheck, LifeBuoy, Check,
} from "lucide-react"
import { VALUE_PROPS } from "@/lib/content/features"
import { PROCESS_STEPS, SECURITY_POINTS, SUPPORT_TIERS } from "@/lib/content/process"
import { FAQS } from "@/lib/content/faqs"
import { EVALUATION } from "@/lib/content/site"
import { SectionHeading, Card, DisclosureNote } from "./ui"
import { cn } from "@/lib/utils"

const valueIcons = { flag: Flag, layers: Layers, clock: Clock, key: KeyRound, wrench: Wrench, settings: Settings2 }

/* ═══════════════ Why AADHAR ═══════════════ */

export function WhyAadhar({ className = "" }) {
  const reduceMotion = useReducedMotion()
  return (
    <section
      className={cn("bg-white px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:py-16 lg:py-20", className)}
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="why-heading"
          eyebrow="Why AADHAR"
          title="Software that fits the business, not the other way round."
          subtitle="We build for Nepali operations — the currency, the paperwork, the printers, the udhaaro book and the way staff actually work at a counter."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPS.map((v, i) => {
            const Icon = valueIcons[v.icon] || Layers
            return (
              <motion.div
                key={v.title}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
                className="h-full"
              >
                <Card interactive className="h-full p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 text-orange-600 ring-1 ring-orange-500/20 dark:text-orange-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{v.body}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ How it works ═══════════════ */

export function HowItWorks({ className = "" }) {
  const reduceMotion = useReducedMotion()
  return (
    <section
      className={cn("bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-900/50 sm:py-16 lg:py-20", className)}
      aria-labelledby="process-heading"
      id="how-it-works"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="process-heading"
          eyebrow="Implementation"
          title="How we get you running."
          subtitle="Three stages, with payment due only after you have used the system and approved it."
        />

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => (
            <motion.li
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector */}
              {i < PROCESS_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+2rem)] top-7 hidden h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-orange-400 to-amber-400/30 md:block"
                />
              )}
              <Card className="h-full p-6 text-center">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-xl font-bold text-white shadow-lg shadow-orange-500/30">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                  {step.description}
                </p>
                <p className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-slate-800 dark:text-slate-500">
                  {step.detail}
                </p>
              </Card>
            </motion.li>
          ))}
        </ol>

        <DisclosureNote className="mx-auto mt-8 max-w-2xl text-center">
          Setup time varies. A single counter with a short product list can go live quickly; a business
          needing data migration, multiple printers, full inventory setup and staff training takes longer.
          We give you a realistic timeline in writing before you commit.
        </DisclosureNote>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/get-quote"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Request a Demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-7 py-3.5 text-sm font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
          >
            Try the interactive preview
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ Security & support ═══════════════ */

export function SecurityAndSupport({ className = "" }) {
  return (
    <section
      className={cn("bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20", className)}
      aria-labelledby="security-heading"
      id="security"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="security-heading"
          eyebrow="Security & Support"
          title="What we actually protect, and what support you actually get."
          subtitle="No certification badges we do not hold, and no support hours we do not staff."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Security and data handling
            </h3>
            <ul className="space-y-3">
              {SECURITY_POINTS.map((p) => (
                <li
                  key={p.title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <LifeBuoy className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Support options
            </h3>
            <ul className="space-y-3">
              {SUPPORT_TIERS.map((tier) => (
                <li
                  key={tier.name}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{tier.name}</p>
                    <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      {tier.availability}
                    </span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5">
                    {tier.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-[13px] text-gray-600 dark:text-slate-400">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <DisclosureNote className="mt-4">
              We do not offer 24/7 support. Support runs during our published hours, and we would rather
              state that plainly than promise a response we cannot staff.
            </DisclosureNote>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ FAQ ═══════════════ */

export function FAQ({ className = "", limit }) {
  const [open, setOpen] = useState(0)
  const baseId = useId()
  const list = limit ? FAQS.slice(0, limit) : FAQS

  return (
    <section
      className={cn("bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-900/50 sm:py-16 lg:py-20", className)}
      aria-labelledby="faq-heading"
      id="faq"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="faq-heading"
          eyebrow="FAQ"
          title="Questions clients ask before they sign."
          subtitle="Answered against what the product does today, not what we hope it will do."
        />

        <dl className="mt-12 space-y-3">
          {list.map((faq, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`
            return (
              <div
                key={faq.q}
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-colors dark:bg-slate-950",
                  isOpen
                    ? "border-orange-500/40 shadow-lg shadow-orange-500/5"
                    : "border-gray-200 dark:border-slate-800"
                )}
              >
                <dt>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                  >
                    <span className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-orange-500"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                {isOpen && (
                  <dd id={panelId} aria-labelledby={buttonId} className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">{faq.a}</p>
                  </dd>
                )}
              </div>
            )
          })}
        </dl>

        {limit && limit < FAQS.length && (
          <p className="mt-8 text-center">
            <Link
              href="/pricing#faq"
              className="text-sm font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
            >
              See all {FAQS.length} questions →
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

/* ═══════════════ Final CTA ═══════════════ */

export function FinalCTA({
  title = "Ready to see it running in your business?",
  subtitle = "Tell us how your business works and we will show you the system configured for it — then you decide.",
  className = "",
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-gray-50 via-orange-50/60 to-gray-50 px-4 py-12 dark:from-slate-900 dark:via-orange-950/25 dark:to-slate-900 sm:py-16 lg:py-20",
        className
      )}
      aria-labelledby="cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,146,60,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,.5) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2
          id="cta-heading"
          className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-slate-400 sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/get-quote"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 motion-safe:hover:-translate-y-0.5"
          >
            Get a Custom Quote
            <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-8 py-4 text-base font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
          >
            Talk to Our Team
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-slate-500">
          {EVALUATION.days}-day no-obligation evaluation · No credit card required · Pay only after you
          approve the system
        </p>
      </div>
    </section>
  )
}
