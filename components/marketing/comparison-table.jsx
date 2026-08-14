"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { COMPARISON, packagesBySegment, SEGMENT_LABELS } from "@/lib/content/packages"
import { npr } from "@/lib/content/format"
import { AVAILABILITY_META } from "@/lib/content/types"
import { SectionHeading, AvailabilityMark, InfoTip, DisclosureNote } from "./ui"
import { cn } from "@/lib/utils"

const SEGMENTS = ["retail", "restaurant", "hotel"]
const LEGEND = ["available", "limited", "addon", "enterprise", "planned", "verification"]

export default function ComparisonTable({ className = "" }) {
  const [segment, setSegment] = useState("restaurant")
  // Feature groups start expanded so nothing is hidden by default; visitors can
  // collapse the ones they don't care about.
  const [collapsed, setCollapsed] = useState({})

  const groups = COMPARISON[segment] || []
  const packages = packagesBySegment(segment)

  const toggle = (title) => setCollapsed((c) => ({ ...c, [`${segment}:${title}`]: !c[`${segment}:${title}`] }))
  const isCollapsed = (title) => Boolean(collapsed[`${segment}:${title}`])

  return (
    <section
      id="compare"
      className={cn("scroll-mt-24 bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20", className)}
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="compare-heading"
          eyebrow="Package Comparison"
          title="Exactly what is in each package."
          subtitle="Every capability is marked with what it actually is — included, limited, an optional add-on, enterprise scope, planned or subject to verification."
        />

        {/* Segment tabs */}
        <div role="tablist" aria-label="Compare packages by industry" className="mt-10 flex flex-wrap justify-center gap-2">
          {SEGMENTS.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={segment === s}
              aria-controls="comparison-grid"
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

        {/* Legend */}
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
          {LEGEND.map((status) => (
            <li key={status} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center">
                <AvailabilityMark status={status} />
              </span>
              {AVAILABILITY_META[status].label}
            </li>
          ))}
          <li className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
            <span className="flex h-5 w-5 items-center justify-center">
              <AvailabilityMark status="no" />
            </span>
            Not available
          </li>
        </ul>

        {/* Table — scrolls horizontally on small screens */}
        <div
          id="comparison-grid"
          className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800"
        >
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">
              {SEGMENT_LABELS[segment]} package comparison by feature category
            </caption>
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 dark:bg-slate-900">
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-[45%] bg-gray-100 px-4 py-4 text-xs font-bold uppercase tracking-wide text-gray-600 dark:bg-slate-900 dark:text-slate-400 sm:w-[50%]"
                >
                  Feature
                </th>
                {packages.map((pkg) => (
                  <th key={pkg.id} scope="col" className="px-3 py-4 text-center">
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">{pkg.name}</span>
                    <span className="mt-1 block text-[11px] font-medium text-gray-500 dark:text-slate-500">
                      {pkg.quoteOnly ? "Custom quotation" : `${npr(pkg.oneTime)} + ${npr(pkg.monthly)}/mo`}
                    </span>
                    {pkg.recommended && (
                      <span className="mt-1.5 inline-block rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                        Recommended
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {groups.map((group) => {
              const hidden = isCollapsed(group.title)
              return (
                <tbody key={group.title} className="border-t border-gray-200 dark:border-slate-800">
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={packages.length + 1}
                      className="bg-gray-50 p-0 text-left dark:bg-slate-900/60"
                    >
                      <button
                        type="button"
                        onClick={() => toggle(group.title)}
                        aria-expanded={!hidden}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-bold text-gray-800 transition-colors hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500 dark:text-slate-200 dark:hover:text-orange-400"
                      >
                        <ChevronDown
                          className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform", hidden && "-rotate-90")}
                          aria-hidden="true"
                        />
                        {group.title}
                        <span className="ml-auto text-[11px] font-medium text-gray-400 dark:text-slate-600">
                          {group.rows.length}
                        </span>
                      </button>
                    </th>
                  </tr>

                  {!hidden &&
                    group.rows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-t border-gray-100 transition-colors hover:bg-orange-500/[0.03] dark:border-slate-800/70"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 bg-white px-4 py-3 text-left text-[13px] font-normal leading-relaxed text-gray-700 dark:bg-slate-950 dark:text-slate-300"
                        >
                          {row.label}
                          {row.hint && <InfoTip label={row.label}>{row.hint}</InfoTip>}
                        </th>
                        {packages.map((pkg) => (
                          <td key={pkg.id} className="px-3 py-3 text-center">
                            <AvailabilityMark status={row.values[pkg.id]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              )
            })}

            {/* CTA row beneath each package column */}
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-900/60">
                <th scope="row" className="sticky left-0 bg-gray-50 px-4 py-5 text-left text-sm font-bold text-gray-800 dark:bg-slate-900 dark:text-slate-200">
                  Ready to start?
                </th>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-3 py-5 text-center">
                    <Link
                      href={pkg.cta.href}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                    >
                      Get a Quote
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <DisclosureNote className="mt-6 text-center lg:hidden">
          Scroll the table sideways to compare all packages.
        </DisclosureNote>

        <DisclosureNote className="mx-auto mt-6 max-w-2xl text-center">
          Capabilities marked <strong>Planned</strong> are not available today and are shown so you can see
          the direction of the product, not to imply they are included. Items marked{" "}
          <strong>Pending</strong> depend on technical verification or an external approval process.
        </DisclosureNote>
      </div>
    </section>
  )
}
