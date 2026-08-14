"use client"

import { useState, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  ReceiptText, LayoutGrid, ChefHat, Package, Users, User, BookOpen,
  BarChart3, Globe, ShieldCheck,
} from "lucide-react"
import { FEATURE_CATEGORIES } from "@/lib/content/features"
import { AVAILABILITY_META } from "@/lib/content/types"
import { SectionHeading, AvailabilityBadge } from "./ui"
import { cn } from "@/lib/utils"

const icons = {
  receipt: ReceiptText,
  layout: LayoutGrid,
  chef: ChefHat,
  package: Package,
  users: Users,
  user: User,
  book: BookOpen,
  chart: BarChart3,
  globe: Globe,
  shield: ShieldCheck,
}

/** Statuses explained once, above the tabs, so every badge is legible. */
const LEGEND = ["available", "addon", "enterprise", "planned", "verification"]

export default function FeatureTabs({
  eyebrow = "Product Capabilities",
  title = "Everything the business needs. Labelled honestly.",
  subtitle = "Each capability below is marked with what it actually is today — included, an optional add-on, enterprise scope, planned, or subject to verification. Nothing planned is presented as available.",
  className = "",
}) {
  const [active, setActive] = useState(FEATURE_CATEGORIES[0].id)
  const tablistRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const category = FEATURE_CATEGORIES.find((c) => c.id === active) || FEATURE_CATEGORIES[0]
  const ActiveIcon = icons[category.icon] || Package

  // Roving arrow-key navigation across the tablist.
  const onKeyDown = (e) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"]
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const idx = FEATURE_CATEGORIES.findIndex((c) => c.id === active)
    let next = idx
    if (e.key === "ArrowRight") next = (idx + 1) % FEATURE_CATEGORIES.length
    if (e.key === "ArrowLeft") next = (idx - 1 + FEATURE_CATEGORIES.length) % FEATURE_CATEGORIES.length
    if (e.key === "Home") next = 0
    if (e.key === "End") next = FEATURE_CATEGORIES.length - 1
    setActive(FEATURE_CATEGORIES[next].id)
    tablistRef.current?.querySelectorAll("[role=tab]")[next]?.focus()
  }

  return (
    <section
      className={cn("bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-900/50 sm:py-16 lg:py-20", className)}
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="features-heading" eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {/* Legend */}
        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {LEGEND.map((status) => (
            <li key={status} className="flex items-center gap-1.5">
              <AvailabilityBadge status={status} />
              <span className="text-xs text-gray-500 dark:text-slate-500">{AVAILABILITY_META[status].label}</span>
            </li>
          ))}
        </ul>

        {/* Tabs */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Feature categories"
          onKeyDown={onKeyDown}
          className="mt-10 flex snap-x gap-2 overflow-x-auto pb-3 lg:flex-wrap lg:justify-center lg:overflow-visible"
        >
          {FEATURE_CATEGORIES.map((c) => {
            const Icon = icons[c.icon] || Package
            const selected = c.id === active
            return (
              <button
                key={c.id}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c.id)}
                className={cn(
                  "flex shrink-0 snap-start items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
                  selected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {c.title}
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <motion.div
          key={category.id}
          role="tabpanel"
          id={`panel-${category.id}`}
          aria-labelledby={`tab-${category.id}`}
          tabIndex={0}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-black/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20"
        >
          <div className="grid lg:grid-cols-5">
            {/* Visual preview */}
            <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500/[0.12] to-amber-500/[0.03] p-8 lg:col-span-2">
              <div
                className="absolute inset-0 opacity-[0.18]"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(251,146,60,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,.4) 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              {category.video && (
                <video
                  key={category.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  className="relative h-36 w-36 object-contain motion-reduce:hidden"
                >
                  <source src={category.video} type="video/webm" />
                </video>
              )}
              <ActiveIcon
                className="absolute h-16 w-16 text-orange-500 opacity-0 motion-reduce:opacity-100"
                aria-hidden="true"
              />
            </div>

            {/* Checklist */}
            <div className="p-6 sm:p-8 lg:col-span-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{category.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                {category.description}
              </p>

              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {category.items.map((item) => (
                  <li key={item.label} className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "text-[13px] leading-relaxed",
                        item.status === "planned"
                          ? "text-gray-400 dark:text-slate-600"
                          : "text-gray-700 dark:text-slate-300"
                      )}
                    >
                      {item.label}
                    </span>
                    <AvailabilityBadge status={item.status} className="mt-0.5 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
