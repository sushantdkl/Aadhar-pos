"use client"

import { useSearchParams } from "next/navigation"
import QuoteForm from "@/components/marketing/quote-form"
import { PACKAGE_OPTIONS, BUSINESS_TYPES } from "@/lib/quote-schema"

/**
 * Reads the `?package=` / `?industry=` deep links used by the pricing cards and
 * solution pages, and pre-fills the form.
 *
 * Kept in its own client component so the page itself stays a server component
 * and `useSearchParams` is properly wrapped in Suspense.
 */

// Solution slugs map onto the form's business types, which use slightly
// different values for the shared verticals.
const INDUSTRY_TO_BUSINESS_TYPE = {
  restaurant: "restaurant",
  retail: "retail",
  hotel: "hotel",
  salon: "salon",
  "tour-travel": "tour-travel",
  "event-venue": "event-venue",
  "custom-software": "custom",
}

const PACKAGE_TO_BUSINESS_TYPE = {
  "retail-starter": "retail",
  "retail-standard": "retail",
  "restaurant-starter": "restaurant",
  "restaurant-standard": "restaurant",
  "hotel-starter": "hotel",
  "hotel-standard": "hotel",
}

export default function QuoteFormSection() {
  const params = useSearchParams()

  const rawPackage = params.get("package") || ""
  const rawIndustry = params.get("industry") || ""

  // Only accept values that exist in the schema — never trust the query string.
  const defaultPackage = PACKAGE_OPTIONS.some((p) => p.value && p.value === rawPackage) ? rawPackage : ""

  const fromIndustry = INDUSTRY_TO_BUSINESS_TYPE[rawIndustry]
  const fromPackage = PACKAGE_TO_BUSINESS_TYPE[defaultPackage]
  const candidate = fromIndustry || fromPackage || ""
  const defaultBusinessType = BUSINESS_TYPES.some((t) => t.value === candidate) ? candidate : ""

  return <QuoteForm defaultPackage={defaultPackage} defaultBusinessType={defaultBusinessType} />
}
