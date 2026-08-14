/**
 * Formatting helpers for the public website.
 *
 * Deliberately separate from `lib/utils.js`, which the internal admin panel
 * uses. The website is Nepal-facing and must always render NPR.
 */

const nprFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** `45000` → `"NPR 45,000"` */
export function npr(amount) {
  if (amount === null || amount === undefined) return "Custom quotation"
  return `NPR ${nprFormatter.format(amount)}`
}

/** `45000` → `"45,000"` (when the NPR label is rendered separately) */
export function nprNumber(amount) {
  if (amount === null || amount === undefined) return "—"
  return nprFormatter.format(amount)
}

/**
 * Renders a package price as the two-part charge it actually is.
 * @returns {{oneTime: string, monthly: string|null, quoteOnly: boolean}}
 */
export function packagePrice(pkg) {
  if (pkg.quoteOnly) {
    return { oneTime: "Custom quotation", monthly: null, quoteOnly: true }
  }
  return {
    oneTime: npr(pkg.oneTime),
    monthly: `${npr(pkg.monthly)}/month`,
    quoteOnly: false,
  }
}

/** Non-binding first-year estimate: one-time + 11 billable months (first month included). */
export function estimateFirstYear({ oneTime, monthly }) {
  if (oneTime === null || monthly === null) return null
  return oneTime + monthly * 11
}

export function formatDateNP(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
