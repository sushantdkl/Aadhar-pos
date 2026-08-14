"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { AVAILABILITY_META } from "@/lib/content/types"
import { Check, Minus, Plus, Building2, Clock3, ShieldQuestion } from "lucide-react"

/* ──────────────────────────────────────────────────────────────
   Shared marketing primitives.
   Keeps spacing, focus states and the orange accent consistent
   across every section instead of re-deriving them per component.
   ────────────────────────────────────────────────────────────── */

export function Eyebrow({ children, className }) {
  return (
    <span
      className={cn(
        "inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase",
        "bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400",
        className
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className, id }) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight text-balance"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-slate-400 leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  )
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:pointer-events-none"

const buttonVariants = {
  primary:
    "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 " +
    "hover:shadow-xl hover:shadow-orange-500/40 motion-safe:hover:-translate-y-0.5",
  secondary:
    "border-2 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white " +
    "hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 dark:hover:border-orange-400",
  ghost:
    "text-orange-600 dark:text-orange-400 hover:bg-orange-500/10",
  subtle:
    "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700",
}

const buttonSizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm sm:text-base",
  lg: "px-7 py-3.5 text-base",
}

export function Button({ as, href, variant = "primary", size = "md", className, children, ...props }) {
  const classes = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)
  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")
    if (external) {
      return (
        <a href={href} className={classes} {...props}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  const Tag = as || "button"
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}

export function Card({ className, children, interactive = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm",
        interactive &&
          "transition-all duration-300 hover:border-orange-400/60 hover:shadow-2xl hover:shadow-orange-500/10 motion-safe:hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── Availability pill ─────────────────────────────────────── */

const availabilityTone = {
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  partial: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  addon: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
  enterprise: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30",
  planned: "bg-gray-500/10 text-gray-600 dark:text-slate-400 border-gray-400/30",
}

export function AvailabilityBadge({ status, className }) {
  const meta = AVAILABILITY_META[status]
  if (!meta) return null
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        availabilityTone[meta.tone],
        className
      )}
    >
      {meta.short}
    </span>
  )
}

/** Icon form used inside the comparison table cells. */
export function AvailabilityMark({ status }) {
  if (status === "no") {
    return (
      <>
        <Minus className="w-4 h-4 mx-auto text-gray-300 dark:text-slate-700" aria-hidden="true" />
        <span className="sr-only">Not available</span>
      </>
    )
  }
  const meta = AVAILABILITY_META[status]
  if (!meta) return null

  if (status === "available") {
    return (
      <>
        <Check className="w-5 h-5 mx-auto text-emerald-500" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (status === "limited") {
    return (
      <>
        <span
          aria-hidden="true"
          className="mx-auto flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-500 text-amber-500"
        >
          <span className="block h-2 w-2 rounded-full bg-amber-500" />
        </span>
        <span className="sr-only">Limited</span>
      </>
    )
  }
  if (status === "addon") {
    return (
      <>
        <Plus className="w-4 h-4 mx-auto text-sky-500" aria-hidden="true" />
        <span className="sr-only">Optional add-on</span>
      </>
    )
  }
  if (status === "enterprise") {
    return (
      <>
        <Building2 className="w-4 h-4 mx-auto text-violet-500" aria-hidden="true" />
        <span className="sr-only">Enterprise only</span>
      </>
    )
  }
  if (status === "planned") {
    return (
      <>
        <Clock3 className="w-4 h-4 mx-auto text-gray-400 dark:text-slate-600" aria-hidden="true" />
        <span className="sr-only">Planned</span>
      </>
    )
  }
  return (
    <>
      <ShieldQuestion className="w-4 h-4 mx-auto text-gray-400 dark:text-slate-500" aria-hidden="true" />
      <span className="sr-only">Subject to verification</span>
    </>
  )
}

/* ── Accessible tooltip (hover + keyboard focus) ───────────── */

export function InfoTip({ label, children }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={`More information: ${label}`}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 dark:border-slate-600 text-[10px] font-bold text-gray-500 dark:text-slate-400 hover:border-orange-500 hover:text-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal leading-relaxed text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-slate-800 dark:ring-1 dark:ring-slate-700"
      >
        {children}
      </span>
    </span>
  )
}

/** A short honest disclosure block — used wherever we limit a claim. */
export function DisclosureNote({ children, className }) {
  return (
    <p
      className={cn(
        "text-xs sm:text-sm text-gray-500 dark:text-slate-500 leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  )
}

export function FeatureList({ items, className, iconClass }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-slate-300">
          <Check
            className={cn("mt-0.5 h-4 w-4 shrink-0 text-orange-500", iconClass)}
            aria-hidden="true"
          />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}
