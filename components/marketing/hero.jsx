"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ShieldCheck, PlayCircle } from "lucide-react"
import POSMock from "./pos-mock"
import { EVALUATION } from "@/lib/content/site"
import { INDUSTRIES } from "@/lib/content/industries"

export default function Hero() {
  const reduceMotion = useReducedMotion()

  // Ambient orange glow — preserved from the original hero, but paused entirely
  // when the visitor prefers reduced motion.
  const glow = (duration, direction) =>
    reduceMotion
      ? {}
      : {
          animate: { scale: direction > 0 ? [1, 1.2, 1] : [1.2, 1, 1.2], rotate: direction > 0 ? [0, 180, 360] : [360, 180, 0] },
          transition: { duration, repeat: Infinity, ease: "linear" },
        }

  return (
    <section className="relative flex items-center overflow-hidden bg-gradient-to-b from-orange-50 via-white to-gray-50 px-4 pb-12 pt-24 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:pt-28 lg:min-h-screen lg:pb-16">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 dark:opacity-20"
          style={{ background: "radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)" }}
          {...glow(20, 1)}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 dark:opacity-20"
          style={{ background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)" }}
          {...glow(15, -1)}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ── Copy ── */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400 sm:text-sm">
                Business software for Nepal
              </span>
            </div>

            <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl xl:text-[3.4rem]">
              Business software built around{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                how you actually work.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-slate-400 sm:text-base">
              From restaurants and retail stores to hotels, salons, travel agencies and event venues,
              AADHAR brings billing, operations, inventory, reporting and business control into one
              connected system.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href="/get-quote"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 motion-safe:hover:-translate-y-0.5"
              >
                Start Your Free Trial
                <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 text-sm sm:text-base font-bold text-gray-800 transition-all hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400 dark:focus-visible:ring-offset-slate-950"
              >
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                Explore Interactive Demo
              </Link>
              <Link
                href="/get-quote"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-orange-600 underline-offset-4 transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-orange-400 sm:text-base"
              >
                Get a Custom Quote
              </Link>
            </div>

            {/* Trust statement — the commercial terms, stated plainly */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{EVALUATION.headline}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                  No credit card required. After approval, the one-time software charge becomes payable and
                  the remainder of the first 30 days of hosting and support is included.{" "}
                  <Link href="/pricing#terms" className="font-medium text-orange-600 underline-offset-2 hover:underline dark:text-orange-400">
                    See full terms
                  </Link>
                </p>
              </div>
            </div>

            {/* Industry chips — real internal links, no dead buttons */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-500">
                Systems we build
              </p>
              <ul className="flex flex-wrap gap-2">
                {INDUSTRIES.map((industry) => (
                  <li key={industry.slug}>
                    <Link
                      href={`/solutions/${industry.slug}`}
                      className="inline-block rounded-full border border-gray-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-orange-400 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
                    >
                      {industry.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Product mock ── */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            animate={reduceMotion ? false : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex items-center justify-center lg:min-h-[520px]"
          >
            <POSMock />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
