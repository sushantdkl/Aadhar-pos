/**
 * Shared vocabulary + runtime validation for pricing and feature content.
 *
 * The project is plain JavaScript, so correctness is enforced two ways:
 *  1. JSDoc typedefs give editor-level type checking and autocomplete.
 *  2. `validateContent()` throws on malformed or conflicting data. It is called
 *     at module load from `lib/content/index.js`, so bad data fails the build
 *     instead of shipping a wrong price to a client.
 */

/**
 * Availability of a capability. Never mark something `available` unless it is
 * implemented and verified in the shipped product.
 * @typedef {"available"|"limited"|"addon"|"enterprise"|"planned"|"verification"} Availability
 */
export const AVAILABILITY = {
  AVAILABLE: "available",
  LIMITED: "limited",
  ADDON: "addon",
  ENTERPRISE: "enterprise",
  PLANNED: "planned",
  VERIFICATION: "verification",
}

export const AVAILABILITY_META = {
  available: { label: "Included", short: "Yes", tone: "positive" },
  limited: { label: "Limited", short: "Limited", tone: "partial" },
  addon: { label: "Optional add-on", short: "Add-on", tone: "addon" },
  enterprise: { label: "Enterprise only", short: "Enterprise", tone: "enterprise" },
  planned: { label: "Planned — not yet available", short: "Planned", tone: "planned" },
  verification: { label: "Subject to verification and approval", short: "Pending", tone: "planned" },
}

export const VALID_AVAILABILITY = Object.values(AVAILABILITY)

/** Industry segments the pricing and comparison tables are grouped by. */
export const SEGMENTS = ["retail", "restaurant", "hotel", "enterprise"]

/**
 * @typedef {Object} Package
 * @property {string} id                 Unique slug.
 * @property {string} segment            One of SEGMENTS.
 * @property {string} name               Display name.
 * @property {string} description        One-line positioning.
 * @property {number|null} oneTime       One-time software licence in NPR, or null for quotation-only.
 * @property {number|null} monthly       Monthly hosting & maintenance in NPR, or null for quotation-only.
 * @property {boolean} [quoteOnly]       True when pricing is by quotation.
 * @property {string} [priceNote]        Extra clarification shown under the price.
 * @property {boolean} [recommended]     Highlights the card.
 * @property {string[]} includes         Included capabilities, plain language.
 * @property {string[]} [excludes]       Explicitly not included — prevents over-promising.
 * @property {string} [inherits]         Package id whose contents this one builds on.
 * @property {{label:string, href:string}} cta
 */

/**
 * @typedef {Object} AddOn
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {number|null} oneTime
 * @property {number|null} monthly
 * @property {boolean} [quoteOnly]
 * @property {string} priceLabel        Human-readable price line (authoritative for display).
 * @property {string[]} features
 * @property {string} [caveat]          Honest limitation shown on the card.
 * @property {Availability} status
 */

const isPositiveInt = (n) => typeof n === "number" && Number.isFinite(n) && n >= 0

/**
 * Validates packages, add-ons and the comparison matrix.
 * @returns {string[]} list of human-readable problems (empty when valid)
 */
export function collectContentErrors({ packages, addOns, comparison }) {
  const errors = []
  const seen = new Set()

  for (const pkg of packages) {
    const at = `package "${pkg.id}"`
    if (!pkg.id) errors.push("A package is missing an id.")
    if (seen.has(pkg.id)) errors.push(`Duplicate package id: ${pkg.id}`)
    seen.add(pkg.id)

    if (!SEGMENTS.includes(pkg.segment)) {
      errors.push(`${at}: segment "${pkg.segment}" is not one of ${SEGMENTS.join(", ")}.`)
    }
    if (pkg.quoteOnly) {
      if (pkg.oneTime !== null || pkg.monthly !== null) {
        errors.push(`${at}: quote-only packages must have null oneTime and monthly prices.`)
      }
    } else {
      if (!isPositiveInt(pkg.oneTime)) errors.push(`${at}: oneTime must be a non-negative number.`)
      if (!isPositiveInt(pkg.monthly)) errors.push(`${at}: monthly must be a non-negative number.`)
    }
    if (!Array.isArray(pkg.includes) || pkg.includes.length === 0) {
      errors.push(`${at}: must list at least one included capability.`)
    }
    if (pkg.inherits && !packages.some((p) => p.id === pkg.inherits)) {
      errors.push(`${at}: inherits unknown package "${pkg.inherits}".`)
    }
    if (pkg.inherits) {
      const parent = packages.find((p) => p.id === pkg.inherits)
      // A higher tier must never cost less than the tier it builds on.
      if (parent && !pkg.quoteOnly && !parent.quoteOnly) {
        if (pkg.oneTime < parent.oneTime) {
          errors.push(`${at}: one-time price (${pkg.oneTime}) is below its base package "${parent.id}" (${parent.oneTime}).`)
        }
        if (pkg.monthly < parent.monthly) {
          errors.push(`${at}: monthly price (${pkg.monthly}) is below its base package "${parent.id}" (${parent.monthly}).`)
        }
      }
      // Something a tier explicitly excludes must not also be inherited as included.
      const parentIncludes = new Set((parent?.includes || []).map((s) => s.toLowerCase()))
      for (const ex of pkg.excludes || []) {
        if (parentIncludes.has(ex.toLowerCase())) {
          errors.push(`${at}: excludes "${ex}" but inherits it from "${parent.id}".`)
        }
      }
    }
    if (!pkg.cta?.href) errors.push(`${at}: missing cta.href.`)
  }

  const addOnIds = new Set()
  for (const a of addOns) {
    const at = `add-on "${a.id}"`
    if (addOnIds.has(a.id)) errors.push(`Duplicate add-on id: ${a.id}`)
    addOnIds.add(a.id)
    if (!a.priceLabel) errors.push(`${at}: missing priceLabel.`)
    if (!VALID_AVAILABILITY.includes(a.status)) {
      errors.push(`${at}: status "${a.status}" is not a valid availability value.`)
    }
    if (a.quoteOnly && (a.oneTime !== null || a.monthly !== null)) {
      errors.push(`${at}: quote-only add-ons must have null prices.`)
    }
  }

  for (const [segment, groups] of Object.entries(comparison)) {
    if (!SEGMENTS.includes(segment)) {
      errors.push(`Comparison matrix has unknown segment "${segment}".`)
      continue
    }
    const segmentPackageIds = packages.filter((p) => p.segment === segment).map((p) => p.id)
    for (const group of groups) {
      for (const row of group.rows) {
        const where = `comparison ${segment} › ${group.title} › ${row.label}`
        for (const pkgId of segmentPackageIds) {
          const value = row.values[pkgId]
          if (value === undefined) {
            errors.push(`${where}: missing a value for package "${pkgId}".`)
          } else if (!VALID_AVAILABILITY.includes(value) && value !== "no") {
            errors.push(`${where}: value "${value}" for "${pkgId}" is not valid.`)
          }
        }
        for (const key of Object.keys(row.values)) {
          if (!segmentPackageIds.includes(key)) {
            errors.push(`${where}: references package "${key}" which is not in segment "${segment}".`)
          }
        }
      }
    }
  }

  return errors
}
