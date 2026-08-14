"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProductDashboard from "./product-dashboard"
import { SectionHeading } from "./ui"

/**
 * Homepage wrapper around the interactive product preview.
 * The preview itself carries the demonstration-data disclosure.
 */
export default function DashboardShowcase({ className = "" }) {
  return (
    <section
      id="product-preview"
      className={`scroll-mt-20 bg-gray-50 px-4 py-20 transition-colors duration-300 dark:bg-slate-900/50 sm:py-24 ${className}`}
      aria-labelledby="preview-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="preview-heading"
          eyebrow="Interactive Preview"
          title="See the system, not a screenshot."
          subtitle="Switch between restaurant, retail and salon, change the date range, and move through the sections. Everything below is a live interface built from the same patterns as the product."
        />

        <div className="mt-12">
          <ProductDashboard />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Open the full interactive demo
            <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
