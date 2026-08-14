"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  UtensilsCrossed, Store, BedDouble, Scissors, Map, CalendarDays, Settings2, ArrowRight, Check,
} from "lucide-react"
import { INDUSTRIES } from "@/lib/content/industries"
import { npr } from "@/lib/content/format"
import { SectionHeading, Card } from "./ui"

export const industryIcons = {
  utensils: UtensilsCrossed,
  store: Store,
  bed: BedDouble,
  scissors: Scissors,
  map: Map,
  calendar: CalendarDays,
  settings: Settings2,
}

const accentRing = {
  orange: "from-orange-500/20 to-amber-500/5",
  amber: "from-amber-500/20 to-orange-500/5",
}

export function SolutionCard({ industry, index = 0 }) {
  const Icon = industryIcons[industry.icon] || Settings2
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35) }}
      className="h-full"
    >
      <Card interactive className="group flex h-full flex-col overflow-hidden">
        {/* Industry visual */}
        <div
          className={`relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br ${
            accentRing[industry.accent] || accentRing.orange
          }`}
        >
          <div
            className="absolute inset-0 opacity-[0.15]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(251,146,60,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,.35) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {industry.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className="relative h-24 w-24 object-contain opacity-80 motion-reduce:hidden"
            >
              <source src={industry.video} type="video/webm" />
            </video>
          ) : null}
          <Icon
            className="absolute h-10 w-10 text-orange-500 opacity-0 motion-reduce:opacity-100"
            aria-hidden="true"
          />
          <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-600 backdrop-blur dark:bg-slate-900/80 dark:text-orange-400">
            {industry.shortName}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{industry.name}</h3>
          </div>

          <p className="mb-5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
            {industry.description}
          </p>

          <ul className="mb-6 space-y-2">
            {industry.features.slice(0, 6).map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-slate-300">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>

          {/* Starting price */}
          <div className="mt-auto">
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/50">
              {industry.startingPrice ? (
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  From{" "}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {npr(industry.startingPrice.oneTime)}
                  </span>{" "}
                  one-time +{" "}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {npr(industry.startingPrice.monthly)}/month
                  </span>
                  {industry.quoteOnly && <span className="block mt-0.5 text-[11px]">Final scope quoted per business.</span>}
                </p>
              ) : (
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  <span className="font-bold text-gray-900 dark:text-white">Custom quotation</span> — scoped
                  after a requirements review.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/solutions/${industry.slug}`}
                className="group/btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              >
                Explore Solution
                <ArrowRight className="h-3.5 w-3.5 transition-transform motion-safe:group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href={`/get-quote?industry=${industry.slug}`}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-slate-200 dark:hover:border-orange-400 dark:hover:text-orange-400"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.article>
  )
}

export default function SolutionCards({
  eyebrow = "Industry Solutions",
  title = "Not one generic POS screen.",
  subtitle = "A restaurant needs KOT tickets and recipe costing. A salon needs token queues and staff commission. A venue needs a booking calendar. AADHAR is a platform configured around each industry's actual operations.",
  limit,
  className = "",
}) {
  const list = limit ? INDUSTRIES.slice(0, limit) : INDUSTRIES

  return (
    <section
      className={`bg-white px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:py-16 lg:py-20 ${className}`}
      aria-labelledby="solutions-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="solutions-heading" eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((industry, i) => (
            <SolutionCard key={industry.slug} industry={industry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
