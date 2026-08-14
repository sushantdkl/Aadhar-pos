import { AVAILABILITY as A } from "./types"

/**
 * Product capability catalogue, grouped into the tabs used on /features and on
 * the homepage feature section.
 *
 * Every item carries an explicit `status`. Nothing is marked `available` unless
 * it is implemented and verified in the shipped product.
 */

export const FEATURE_CATEGORIES = [
  {
    id: "pos-billing",
    title: "POS and Billing",
    icon: "receipt",
    description:
      "The screen your staff live on. Fast product lookup, keyboard-friendly entry, discounts, VAT handling and printed receipts.",
    video: "/Scan Matrix.webm",
    items: [
      { label: "Fast billing screen with search and category filters", status: A.AVAILABLE },
      { label: "Barcode scanning", status: A.AVAILABLE },
      { label: "Discounts and service charge", status: A.AVAILABLE },
      { label: "VAT-inclusive billing display", status: A.AVAILABLE },
      { label: "Receipt printing (58mm and 80mm thermal)", status: A.AVAILABLE },
      { label: "Held and parked bills", status: A.AVAILABLE },
      { label: "Cash and QR payment recording", status: A.AVAILABLE },
      { label: "Split payment across methods", status: A.AVAILABLE },
      { label: "Split by seat or by item", status: A.PLANNED },
      { label: "Business-day open and close with cash reconciliation", status: A.AVAILABLE },
    ],
  },
  {
    id: "orders-tables",
    title: "Orders and Tables",
    icon: "layout",
    description:
      "Dine-in, takeaway and delivery handled distinctly, with a floor view that reflects what is actually happening in the room.",
    video: "/multichannel.webm",
    items: [
      { label: "Dine-in, takeaway and delivery order types", status: A.AVAILABLE },
      { label: "Floor and table management", status: A.AVAILABLE },
      { label: "Table transfer and merge", status: A.AVAILABLE },
      { label: "Order modification with audit record", status: A.AVAILABLE },
      { label: "Multi-floor layouts", status: A.AVAILABLE },
      { label: "Table reservations", status: A.PLANNED },
      { label: "Waiter-side mobile ordering", status: A.PLANNED },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen Operations",
    icon: "chef",
    description:
      "Orders reach the kitchen as structured tickets, and preparation time becomes a number you can manage.",
    video: "/Work flow Gear Animation.webm",
    items: [
      { label: "KOT printing", status: A.AVAILABLE },
      { label: "Kitchen display system (KDS)", status: A.AVAILABLE },
      { label: "KOT preparation-time tracking", status: A.AVAILABLE },
      { label: "Item-level ready marking", status: A.AVAILABLE },
      { label: "Multiple kitchen stations", status: A.LIMITED },
      { label: "Kitchen performance analytics", status: A.AVAILABLE },
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: "package",
    description:
      "Stock that moves when you sell. Recipes deduct ingredients, purchases add them, and wastage is recorded rather than absorbed.",
    video: "/Inventory.webm",
    items: [
      { label: "Product and ingredient stock tracking", status: A.AVAILABLE },
      { label: "Recipe management with automatic deduction", status: A.AVAILABLE },
      { label: "Purchases and supplier records", status: A.AVAILABLE },
      { label: "Low-stock alerts", status: A.AVAILABLE },
      { label: "Wastage and spoilage recording", status: A.AVAILABLE },
      { label: "Stock adjustment with reason codes", status: A.AVAILABLE },
      { label: "Bulk product import", status: A.ADDON },
      { label: "Batch and expiry tracking", status: A.PLANNED },
    ],
  },
  {
    id: "staff-payroll",
    title: "Staff and Payroll",
    icon: "users",
    description:
      "Who did what, on which shift, for how much. Roles restrict access; payroll works from recorded activity.",
    video: "/Form filling.webm",
    items: [
      { label: "Staff accounts with role-based permissions", status: A.AVAILABLE },
      { label: "Employee records", status: A.AVAILABLE },
      { label: "Payroll and salary processing", status: A.AVAILABLE },
      { label: "Salary advances and settlements", status: A.AVAILABLE },
      { label: "Staff commission (salon)", status: A.AVAILABLE },
      { label: "Attendance and shift management", status: A.ADDON },
      { label: "Biometric device integration", status: A.PLANNED },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    icon: "user",
    description:
      "Customer records that carry balances and history, so credit is a tracked number rather than a note in a diary.",
    video: "/ai.webm",
    items: [
      { label: "Customer records", status: A.AVAILABLE },
      { label: "Customer credit (udhaaro) with balances", status: A.AVAILABLE },
      { label: "Receivables ageing", status: A.AVAILABLE },
      { label: "Purchase and visit history", status: A.AVAILABLE },
      { label: "Packages and prepaid services (salon)", status: A.AVAILABLE },
      { label: "SMS receipts and reminders", status: A.ADDON },
      { label: "Loyalty points programme", status: A.PLANNED },
    ],
  },
  {
    id: "accounting",
    title: "Accounting",
    icon: "book",
    description:
      "Books that follow from operations: expenses, cash and bank movement, payables and receivables, and statements that reconcile.",
    video: "/finance graphs.webm",
    items: [
      { label: "Expense recording with categories", status: A.AVAILABLE },
      { label: "Cash book and bank book", status: A.AVAILABLE },
      { label: "Accounts receivable and payable", status: A.AVAILABLE },
      { label: "Savings and settlements", status: A.AVAILABLE },
      { label: "Profit-and-loss report", status: A.AVAILABLE },
      { label: "Balance sheet and cash-flow reports", status: A.AVAILABLE },
      { label: "Full ledger access with journals", status: A.ENTERPRISE },
      { label: "Approval workflows", status: A.ENTERPRISE },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    icon: "chart",
    description:
      "Reporting built for decisions — what sold, what it cost, what is owed and what is sitting still.",
    video: "/Chart Grow Up.webm",
    items: [
      { label: "Daily sales summary", status: A.AVAILABLE },
      { label: "Sales by order type, category and payment method", status: A.AVAILABLE },
      { label: "Top-selling products", status: A.AVAILABLE },
      { label: "Ingredient consumption", status: A.AVAILABLE },
      { label: "Gross and net profit", status: A.AVAILABLE },
      { label: "Occupancy and revenue reports (hotel)", status: A.AVAILABLE },
      { label: "Consolidated multi-outlet reporting", status: A.ENTERPRISE },
      { label: "Custom dashboards", status: A.ENTERPRISE },
      { label: "Scheduled report email", status: A.PLANNED },
    ],
  },
  {
    id: "online",
    title: "Online Ordering",
    icon: "globe",
    description:
      "A public face for the business — QR menu, catalogue and order requests that arrive in the same system.",
    video: "/cloud.webm",
    items: [
      { label: "QR menu", status: A.AVAILABLE },
      { label: "Online-order requests (restaurant)", status: A.AVAILABLE },
      { label: "Online store / e-commerce (retail)", status: A.ADDON },
      { label: "WhatsApp ordering", status: A.AVAILABLE },
      { label: "Branded website with CMS", status: A.AVAILABLE },
      { label: "Gallery and content management", status: A.AVAILABLE },
      { label: "Payment gateway (automated settlement)", status: A.VERIFICATION },
      { label: "Third-party delivery platform sync", status: A.PLANNED },
    ],
  },
  {
    id: "security",
    title: "Security and Controls",
    icon: "shield",
    description:
      "Access control, backups and an audit record — so you can tell who changed what, and recover when something goes wrong.",
    video: "/security.webm",
    items: [
      { label: "User login with role-based access control", status: A.AVAILABLE },
      { label: "Encrypted data transmission", status: A.AVAILABLE },
      { label: "Scheduled cloud backup", status: A.AVAILABLE },
      { label: "Restore from backup", status: A.AVAILABLE },
      { label: "Edit, void and discount audit records", status: A.AVAILABLE },
      { label: "Multi-level permissions", status: A.ENTERPRISE },
      { label: "Complete audit trails", status: A.ENTERPRISE },
      { label: "IRD / CBMS compliance controls", status: A.VERIFICATION },
    ],
  },
]

/** Short "why AADHAR" value propositions. Deliberately free of numeric claims. */
export const VALUE_PROPS = [
  {
    title: "Built for how Nepali businesses run",
    body: "NPR, VAT, udhaaro, QR payments, thermal printers and the paperwork you actually deal with — not a foreign product with a currency setting changed.",
    icon: "flag",
  },
  {
    title: "Industry-specific, not one generic screen",
    body: "A restaurant needs KOT and recipes; a salon needs tokens and commission; a venue needs a booking calendar. Each gets the system that fits it.",
    icon: "layers",
  },
  {
    title: "Try it before you pay for it",
    body: "A 15-day no-obligation evaluation on a configured environment. The one-time charge becomes payable only after you approve the system.",
    icon: "clock",
  },
  {
    title: "One-time licence, no annual renewal",
    body: "You buy the software once. The monthly charge covers cloud hosting, your domain, backups, maintenance and support — and we say so plainly.",
    icon: "key",
  },
  {
    title: "We configure it with you",
    body: "Menus, products, opening stock, printers, staff roles and training are part of onboarding, not homework left to you.",
    icon: "wrench",
  },
  {
    title: "Custom work is a real option",
    body: "If a standard package does not fit, we scope, quote and build around your workflow instead of forcing you into a template.",
    icon: "settings",
  },
]
