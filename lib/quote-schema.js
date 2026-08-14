/**
 * Quotation request schema and validation.
 *
 * Shared by the client form and the API route so a field can never be validated
 * one way in the browser and another way on the server. The server always
 * re-validates — client-side checks are for usability only.
 */

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant / Café" },
  { value: "retail", label: "Retail" },
  { value: "hotel", label: "Hotel" },
  { value: "salon", label: "Salon / Barbershop" },
  { value: "tour-travel", label: "Tour and Travel" },
  { value: "event-venue", label: "Event Venue" },
  { value: "custom", label: "Custom Business" },
]

export const CONTACT_METHODS = [
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "visit", label: "In-person visit" },
]

export const MODULES = [
  "POS and billing",
  "Inventory and stock",
  "Purchases and suppliers",
  "Customer credit",
  "Accounting and reports",
  "Staff and payroll",
  "Kitchen / KOT",
  "Table management",
  "Room / reservation management",
  "Appointments and queue",
  "Booking calendar",
  "Website and CMS",
]

export const HARDWARE = [
  "Thermal receipt printer",
  "Barcode scanner",
  "Cash drawer",
  "Billing computer / POS terminal",
  "Tablet",
  "Kitchen display screen",
  "None — I have my own",
]

export const PACKAGE_OPTIONS = [
  { value: "", label: "Not sure yet — recommend one" },
  { value: "retail-starter", label: "Retail Starter" },
  { value: "retail-standard", label: "Retail Standard" },
  { value: "restaurant-starter", label: "Restaurant Starter" },
  { value: "restaurant-standard", label: "Restaurant Standard" },
  { value: "hotel-starter", label: "Hotel Starter" },
  { value: "hotel-standard", label: "Hotel Standard" },
  { value: "enterprise", label: "Enterprise / Custom" },
]

/** Business types for which each conditional numeric field is relevant. */
export const CONDITIONAL_FIELDS = {
  tableCount: ["restaurant"],
  roomCount: ["hotel"],
  productCount: ["retail", "restaurant", "salon"],
}

/* ── field-level validators ───────────────────────────────── */

const MAX = { short: 120, medium: 200, long: 2000 }

/**
 * Nepal phone numbers.
 * Mobile: 10 digits starting 97/98 (e.g. 9801234567).
 * Landline: area code + 6–7 digits (e.g. 01-4123456).
 * An optional +977 / 977 country prefix is accepted and stripped.
 */
export function normalizeNepalPhone(input) {
  if (typeof input !== "string") return null
  const digits = input.replace(/[^\d+]/g, "").replace(/^\+?977/, "")
  if (/^9[678]\d{8}$/.test(digits)) return digits
  if (/^0\d{1,2}\d{6,7}$/.test(digits) && digits.length >= 8 && digits.length <= 10) return digits
  return null
}

export function isValidEmail(value) {
  if (typeof value !== "string") return false
  // Deliberately permissive but structural — rejects the common typo shapes.
  return /^[^\s@]+@[^\s@,]+\.[a-zA-Z]{2,}$/.test(value.trim()) && value.length <= MAX.medium
}

const str = (v) => (typeof v === "string" ? v.trim() : "")
const num = (v) => {
  if (v === "" || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? Math.floor(n) : NaN
}

/**
 * Validates a quote payload.
 * @returns {{valid: boolean, errors: Record<string,string>, data: object|null}}
 */
export function validateQuote(raw) {
  const errors = {}
  const input = raw && typeof raw === "object" ? raw : {}

  const fullName = str(input.fullName)
  if (fullName.length < 2) errors.fullName = "Please enter your full name."
  else if (fullName.length > MAX.short) errors.fullName = "Name is too long."

  const businessName = str(input.businessName)
  if (businessName.length < 2) errors.businessName = "Please enter your business name."
  else if (businessName.length > MAX.short) errors.businessName = "Business name is too long."

  const phoneRaw = str(input.phone)
  const phone = normalizeNepalPhone(phoneRaw)
  if (!phoneRaw) errors.phone = "Please enter a phone number."
  else if (!phone) errors.phone = "Enter a valid Nepal number, e.g. 9801234567 or 01-4123456."

  const email = str(input.email)
  if (!email) errors.email = "Please enter an email address."
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address."

  const businessType = str(input.businessType)
  if (!BUSINESS_TYPES.some((t) => t.value === businessType)) {
    errors.businessType = "Please choose your business type."
  }

  const location = str(input.location)
  if (location.length < 2) errors.location = "Please enter your business location."
  else if (location.length > MAX.medium) errors.location = "Location is too long."

  const outlets = num(input.outlets)
  if (Number.isNaN(outlets)) errors.outlets = "Enter a valid number of outlets."

  const users = num(input.users)
  if (Number.isNaN(users)) errors.users = "Enter a valid number of users."

  const selectedPackage = str(input.selectedPackage)
  if (selectedPackage && !PACKAGE_OPTIONS.some((p) => p.value === selectedPackage)) {
    errors.selectedPackage = "Unknown package selection."
  }

  const tableCount = num(input.tableCount)
  if (Number.isNaN(tableCount)) errors.tableCount = "Enter a valid number of tables."
  const roomCount = num(input.roomCount)
  if (Number.isNaN(roomCount)) errors.roomCount = "Enter a valid number of rooms."
  const productCount = num(input.productCount)
  if (Number.isNaN(productCount)) errors.productCount = "Enter a valid estimate."

  const currentSoftware = str(input.currentSoftware).slice(0, MAX.medium)
  const additionalRequirements = str(input.additionalRequirements)
  if (additionalRequirements.length > MAX.long) {
    errors.additionalRequirements = "Please keep this under 2000 characters."
  }

  const contactMethod = str(input.contactMethod) || "phone"
  if (!CONTACT_METHODS.some((m) => m.value === contactMethod)) {
    errors.contactMethod = "Choose a preferred contact method."
  }

  const asArray = (v, allowed) =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string" && allowed.includes(x)).slice(0, 30) : []

  const modules = asArray(input.modules, MODULES)
  const hardware = asArray(input.hardware, HARDWARE)

  const installDate = str(input.installDate)
  if (installDate && !/^\d{4}-\d{2}-\d{2}$/.test(installDate)) {
    errors.installDate = "Choose a valid date."
  }

  if (input.consent !== true && input.consent !== "true" && input.consent !== "on") {
    errors.consent = "Please confirm you agree to be contacted about this request."
  }

  const bool = (v) => v === true || v === "true" || v === "on"

  const valid = Object.keys(errors).length === 0

  return {
    valid,
    errors,
    data: valid
      ? {
          fullName,
          businessName,
          phone,
          phoneRaw,
          email: email.toLowerCase(),
          businessType,
          location,
          outlets: outlets ?? 1,
          users: users ?? 1,
          selectedPackage: selectedPackage || null,
          currentSoftware: currentSoftware || null,
          modules,
          tableCount,
          roomCount,
          productCount,
          needsDataMigration: bool(input.needsDataMigration),
          needsWebsite: bool(input.needsWebsite),
          needsOnlineOrdering: bool(input.needsOnlineOrdering),
          needsPaymentIntegration: bool(input.needsPaymentIntegration),
          needsIrdIntegration: bool(input.needsIrdIntegration),
          hardware,
          installDate: installDate || null,
          additionalRequirements: additionalRequirements || null,
          contactMethod,
          consent: true,
        }
      : null,
  }
}

/**
 * Human-readable quotation reference, e.g. `AQ-260814-7K2M`.
 * Deterministic prefix by date so leads sort naturally.
 */
export function generateReference(date = new Date(), randomSource) {
  const yy = String(date.getFullYear()).slice(2)
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no I/O/0/1
  let suffix = ""
  const bytes = randomSource || (() => Math.floor(Math.random() * alphabet.length))
  for (let i = 0; i < 4; i++) suffix += alphabet[bytes(i) % alphabet.length]
  return `AQ-${yy}${mm}${dd}-${suffix}`
}

/**
 * Non-binding estimate from the selected package plus flagged add-ons.
 * Mirrors `lib/content/packages.js`; kept as pure numbers so it can run on both
 * client and server without importing presentation code.
 */
const PACKAGE_PRICES = {
  "retail-starter": { oneTime: 15000, monthly: 1000 },
  "retail-standard": { oneTime: 30000, monthly: 2000 },
  "restaurant-starter": { oneTime: 20000, monthly: 1000 },
  "restaurant-standard": { oneTime: 40000, monthly: 2000 },
  "hotel-starter": { oneTime: 30000, monthly: 1500 },
  "hotel-standard": { oneTime: 50000, monthly: 2500 },
}

const ADDON_PRICES = {
  needsDataMigration: { label: "Data migration", oneTime: 5000, monthly: 0 },
  // The custom website is included in every package, including the lowest
  // tier, so it carries no add-on cost. The flag is still captured so the
  // team knows whether the client needs one built or already has one.
  needsWebsite: { label: "Custom website & CMS (included)", oneTime: 0, monthly: 0 },
  // Online ordering is handled separately in estimateQuote, because it means
  // two different products: restaurant order requests (included from
  // Restaurant Standard) versus a retail e-commerce store (a paid add-on).
  needsPaymentIntegration: { label: "Payment gateway integration", oneTime: 0, monthly: 0, quoteOnly: true },
  needsIrdIntegration: { label: "IRD / CBMS integration", oneTime: 0, monthly: 0, quoteOnly: true },
}

/**
 * @returns {{oneTime:number, monthly:number, lines:Array, hasQuoteOnly:boolean}|null}
 */
export function estimateQuote(data) {
  const base = PACKAGE_PRICES[data.selectedPackage]
  if (!base) return null

  const lines = [{ label: "Software licence", oneTime: base.oneTime, monthly: base.monthly }]
  let oneTime = base.oneTime
  let monthly = base.monthly
  let hasQuoteOnly = false

  for (const [key, addon] of Object.entries(ADDON_PRICES)) {
    if (!data[key]) continue
    if (addon.quoteOnly) {
      hasQuoteOnly = true
      lines.push({ label: addon.label, quoteOnly: true })
      continue
    }
    oneTime += addon.oneTime
    monthly += addon.monthly
    lines.push({ label: addon.label, oneTime: addon.oneTime, monthly: addon.monthly })
  }

  // Online ordering means different things per industry, so it is priced here
  // rather than in the flat ADDON_PRICES table.
  if (data.needsOnlineOrdering) {
    if (data.businessType === "retail") {
      // A retail online store is a separate e-commerce build, charged on top.
      hasQuoteOnly = true
      lines.push({ label: "Online store / e-commerce", quoteOnly: true })
    } else {
      // Restaurant and hotel ordering ships with the Standard packages.
      lines.push({ label: "Online & WhatsApp ordering", oneTime: 0, monthly: 0 })
    }
  }

  // More than one outlet always requires a quotation rather than a multiplier.
  if (data.outlets > 1) {
    hasQuoteOnly = true
    lines.push({ label: `${data.outlets - 1} additional outlet(s)`, quoteOnly: true })
  }

  return { oneTime, monthly, lines, hasQuoteOnly }
}
