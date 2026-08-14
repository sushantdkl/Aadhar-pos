import { AVAILABILITY as A, collectContentErrors } from "./types"

/**
 * Pricing source of truth.
 *
 * Commercial model: a one-time software licence plus a monthly hosting and
 * maintenance service. The purchased version carries no annual licence renewal;
 * the monthly charge covers cloud hosting, the domain, backups, maintenance and support.
 *
 * All figures are NPR and exclude 13% VAT.
 *
 * @type {import("./types").Package[]}
 */
export const PACKAGES = [
  // ─────────────────────────── RETAIL ───────────────────────────
  {
    id: "retail-starter",
    segment: "retail",
    name: "Retail Starter",
    description: "For a small shop or single billing counter.",
    oneTime: 15000,
    monthly: 1000,
    includes: [
      "One business outlet",
      "Public customer website with CMS, gallery and domain included",
      "WhatsApp contact button on your website",
      "Basic POS billing",
      "Product and category management",
      "Barcode support",
      "Basic stock tracking",
      "Cash and QR payment recording",
      "Receipt printing",
      "Daily sales summary",
      "Basic expense tracking",
      "Up to 2 staff accounts",
      "Basic remote support",
      "15-day evaluation",
    ],
    excludes: [
      "Online store / e-commerce (paid add-on)",
      "WhatsApp ordering integration",
      "Full accounting",
      "Advanced inventory",
      "Payroll",
      "Multi-branch",
      "Custom integrations",
      "IRD/CBMS integration",
    ],
    cta: { label: "Get a Quote", href: "/get-quote?package=retail-starter" },
  },
  {
    id: "retail-standard",
    segment: "retail",
    name: "Retail Standard",
    description: "The complete retail system with inventory, credit and accounts.",
    oneTime: 30000,
    monthly: 2000,
    recommended: true,
    inherits: "retail-starter",
    includes: [
      "Everything in Retail Starter",
      "Full inventory management",
      "Suppliers and purchases",
      "Low-stock alerts",
      "Customer credit",
      "Accounts receivable and payable",
      "Advanced expense management",
      "Staff roles and permissions",
      "Cash book and bank book",
      "WhatsApp ordering integration",
      "Advanced reports",
      "Data backup",
      "Up to 5 staff accounts",
      "Standard onboarding",
      "Priority remote support",
    ],
    excludes: ["Online store / e-commerce (available as a paid add-on)"],
    cta: { label: "Get a Quote", href: "/get-quote?package=retail-standard" },
  },

  // ────────────────────────── RESTAURANT ──────────────────────────
  {
    id: "restaurant-starter",
    segment: "restaurant",
    name: "Restaurant Starter",
    description: "For a small café, takeaway or single-counter restaurant.",
    oneTime: 20000,
    monthly: 1000,
    includes: [
      "Restaurant POS",
      "Public customer website with CMS, gallery and domain included",
      "WhatsApp contact button on your website",
      "Menu and category management",
      "Dine-in and takeaway",
      "Basic table management",
      "KOT printing",
      "Receipt printing",
      "Cash and QR payment recording",
      "Basic stock tracking",
      "Daily sales report",
      "Up to 3 staff accounts",
      "One outlet",
      "Basic onboarding",
      "15-day evaluation",
    ],
    excludes: [
      "WhatsApp ordering integration",
      "Full recipe costing",
      "Complete accounting",
      "Advanced KDS analytics",
      "Online ordering",
      "Payroll",
      "Multi-branch",
      "IRD/CBMS integration",
    ],
    cta: { label: "Get a Quote", href: "/get-quote?package=restaurant-starter" },
  },
  {
    id: "restaurant-standard",
    segment: "restaurant",
    name: "Restaurant Standard",
    description: "Full restaurant operations from kitchen to balance sheet.",
    oneTime: 40000,
    monthly: 2000,
    recommended: true,
    inherits: "restaurant-starter",
    includes: [
      "Everything in Restaurant Starter",
      "Dine-in, takeaway and delivery",
      "Floor and table management",
      "KOT and kitchen display",
      "Split-payment allocation",
      "Customer credit",
      "Recipe and ingredient management",
      "Automatic stock deduction",
      "Purchases and suppliers",
      "Wastage tracking",
      "Employee management",
      "Payroll and salary advances",
      "Accounts receivable and payable",
      "Expenses, savings and settlements",
      "Cash book and bank book",
      "Profit-and-loss report",
      "Balance sheet and cash-flow reports",
      "Kitchen and menu analytics",
      "QR menu",
      "Online-ordering support",
      "WhatsApp ordering integration",
      "Up to 10 staff accounts",
      "Priority support",
    ],
    cta: { label: "Get a Quote", href: "/get-quote?package=restaurant-standard" },
  },

  // ──────────────────────────── HOTEL ────────────────────────────
  {
    id: "hotel-starter",
    segment: "hotel",
    name: "Hotel Starter",
    description: "Rooms, reservations and guest billing for a single property.",
    oneTime: 30000,
    monthly: 1500,
    includes: [
      "One hotel property",
      "Public customer website with CMS, gallery and domain included",
      "WhatsApp contact button on your website",
      "Room and room-type management",
      "Guest records",
      "Reservation calendar",
      "Check-in and check-out",
      "Basic billing",
      "Payment tracking",
      "Occupancy report",
      "Expense tracking",
      "Staff permissions",
      "Standard onboarding",
      "15-day evaluation",
    ],
    excludes: [
      "Online booking requests",
      "WhatsApp ordering integration",
      "Housekeeping workflow",
      "Payroll",
      "Advanced financial reports",
      "Multi-property",
      "IRD/CBMS integration",
    ],
    cta: { label: "Get a Quote", href: "/get-quote?package=hotel-starter" },
  },
  {
    id: "hotel-standard",
    segment: "hotel",
    name: "Hotel Standard",
    description: "Adds housekeeping, payroll and financial depth.",
    oneTime: 50000,
    monthly: 2500,
    recommended: true,
    inherits: "hotel-starter",
    includes: [
      "Everything in Hotel Starter",
      "Housekeeping workflow",
      "Advanced reservation controls",
      "Customer history",
      "Additional billing controls",
      "Accounts receivable",
      "Supplier and expense management",
      "Payroll",
      "Advanced financial reports",
      "Online booking requests",
      "WhatsApp ordering integration",
      "Up to 10 staff accounts",
      "Priority support",
    ],
    cta: { label: "Get a Quote", href: "/get-quote?package=hotel-standard" },
  },

  // ───────────────────── ENTERPRISE & CUSTOM ─────────────────────
  {
    id: "enterprise",
    segment: "enterprise",
    name: "Enterprise & Premium",
    description: "Multi-outlet groups, custom integrations and dedicated onboarding.",
    oneTime: null,
    monthly: null,
    quoteOnly: true,
    recommended: true,
    priceNote:
      "Typical projects start near NPR 80,000 one-time plus NPR 5,000/month, depending on outlets, users, integrations, data migration and customization. Final pricing is confirmed only after a requirements review.",
    includes: [
      "All relevant standard-package features",
      "Public customer website with CMS, gallery and domain included",
      "WhatsApp ordering integration and online ordering",
      "Full accounting access",
      "Complete audit trails",
      "Multi-level permissions",
      "Approval workflows",
      "Multiple outlets or branches",
      "Consolidated reporting",
      "Custom dashboards",
      "Data migration",
      "Dedicated onboarding",
      "Custom integrations",
      "Payment-gateway integration",
      "Priority SLA",
      "Advanced backups",
      "Custom training",
      "IRD/CBMS integration after technical verification and approval",
    ],
    cta: { label: "Discuss Your Requirements", href: "/get-quote?package=enterprise" },
  },
]

/**
 * Optional add-ons.
 * @type {import("./types").AddOn[]}
 */
export const ADD_ONS = [
  {
    id: "attendance",
    name: "Attendance & Shift Management",
    summary: "Track staff hours, shifts and leave alongside payroll.",
    oneTime: 5000,
    monthly: null,
    priceLabel: "From NPR 5,000 one-time per location",
    features: [
      "Staff check-in and check-out",
      "Shift scheduling",
      "Attendance reports",
      "Leave records",
      "Overtime records",
    ],
    caveat: "Biometric device integration is not included and is quoted separately once tested with your hardware.",
    status: A.ADDON,
  },
  {
    id: "sms",
    name: "SMS Notifications",
    summary: "Send receipts, confirmations and reminders by SMS.",
    oneTime: null,
    monthly: null,
    quoteOnly: true,
    priceLabel: "Usage-based quotation",
    features: [
      "Digital receipt messages",
      "Order confirmations",
      "Low-stock alerts",
      "Reservation reminders",
      "Delivery-status messages",
    ],
    caveat: "SMS provider charges are billed separately at the provider's prevailing rate. We do not resell messages at a fixed price.",
    status: A.ADDON,
  },
  {
    id: "event-hall",
    name: "Event Hall Booking",
    summary: "Manage halls, event packages and staged payments.",
    oneTime: 10000,
    monthly: 500,
    priceLabel: "From NPR 10,000 one-time + from NPR 500/month",
    features: [
      "Booking calendar",
      "Capacity tracking",
      "Event packages",
      "Advance-payment tracking",
      "Remaining-payment tracking",
      "Invoicing",
      "Resource allocation",
    ],
    status: A.ADDON,
  },
  {
    id: "ecommerce",
    name: "Online Store / E-commerce",
    summary: "A customer-facing online store for retail, on top of your included website.",
    oneTime: null,
    monthly: null,
    quoteOnly: true,
    priceLabel: "Custom quotation",
    features: [
      "Product catalogue with online purchasing",
      "Cart and checkout",
      "Order management linked to your stock",
      "Delivery and pickup options",
      "Customer accounts and order history",
      "Sales reporting for online orders",
    ],
    caveat:
      "This is a separate e-commerce build for retail businesses and is charged on top of your package. It is not the same as restaurant online ordering, which is included from Restaurant Standard. Payment collection requires a payment-gateway integration, quoted separately.",
    status: A.ADDON,
  },
  {
    id: "extra-outlet",
    name: "Additional Outlet or Branch",
    summary: "Extend an existing licence to another location.",
    oneTime: null,
    monthly: null,
    quoteOnly: true,
    priceLabel: "Custom quotation",
    features: [
      "Separate outlet controls",
      "Branch-level users",
      "Branch reports",
      "Central dashboard",
      "Consolidated reporting",
    ],
    caveat: "Availability depends on branch isolation being verified for your configuration. Confirmed during the requirements review.",
    status: A.VERIFICATION,
  },
  {
    id: "data-migration",
    name: "Data Migration",
    summary: "Bring your existing products, customers and balances across.",
    oneTime: 5000,
    monthly: null,
    priceLabel: "From NPR 5,000 one-time",
    features: [
      "Product import",
      "Customer import",
      "Supplier import",
      "Opening-stock import",
      "Opening-balance import",
    ],
    caveat: "Final cost depends on the quality and volume of your source data.",
    status: A.ADDON,
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway Integration",
    summary: "Automated settlement and webhook handling with Nepali providers.",
    oneTime: null,
    monthly: null,
    quoteOnly: true,
    priceLabel: "Custom quotation",
    features: [
      "Fonepay",
      "eSewa",
      "Khalti",
      "Supported banking partners",
      "Webhook handling",
      "Settlement reporting",
    ],
    caveat: "Requires a merchant agreement with the provider. Manual QR recording is included in the base packages and is not a gateway integration.",
    status: A.VERIFICATION,
  },
  {
    id: "ird-cbms",
    name: "IRD & CBMS Integration",
    summary: "PAN/VAT billing controls and CBMS submission.",
    oneTime: null,
    monthly: null,
    quoteOnly: true,
    priceLabel: "Quotation only — subject to verification and approval",
    features: [
      "PAN/VAT configuration",
      "Controlled invoice numbering",
      "Credit-note workflow",
      "CBMS submission",
      "Synchronization status",
      "Audit history",
      "Tax reports",
    ],
    caveat: "Activation depends on technical readiness and the applicable approval process. We do not claim verified real-time IRD validation until that process is complete.",
    status: A.VERIFICATION,
  },
]

/**
 * Package comparison matrix, grouped by feature category and keyed by package id.
 * Values are Availability strings, or "no" when the capability is not offered.
 */
export const COMPARISON = {
  retail: [
    {
      title: "Core POS",
      rows: [
        { label: "Fast billing screen", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Barcode scanning", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Receipt printing", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Business-day closing", values: { "retail-starter": A.LIMITED, "retail-standard": A.AVAILABLE }, hint: "Starter records a daily summary; Standard adds a full open/close cash reconciliation." },
        { label: "Held / parked bills", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Menu and products",
      rows: [
        { label: "Product and category management", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Multiple price levels", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Bulk product import", values: { "retail-starter": A.ADDON, "retail-standard": A.ADDON }, hint: "Delivered through the Data Migration add-on." },
      ],
    },
    {
      title: "Inventory",
      rows: [
        { label: "Basic stock tracking", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Full inventory management", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Low-stock alerts", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Stock adjustments and audit", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Purchases and suppliers",
      rows: [
        { label: "Supplier records", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Purchase entry", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Supplier payables", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Customers and credit",
      rows: [
        { label: "Customer records", values: { "retail-starter": A.LIMITED, "retail-standard": A.AVAILABLE } },
        { label: "Customer credit (udhaaro)", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Receivables tracking", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Staff and payroll",
      rows: [
        { label: "Staff accounts", values: { "retail-starter": A.LIMITED, "retail-standard": A.AVAILABLE }, hint: "Starter: up to 2 accounts. Standard: up to 5." },
        { label: "Roles and permissions", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Payroll and salary advances", values: { "retail-starter": "no", "retail-standard": A.ENTERPRISE } },
        { label: "Attendance and shifts", values: { "retail-starter": A.ADDON, "retail-standard": A.ADDON } },
      ],
    },
    {
      title: "Accounting",
      rows: [
        { label: "Basic expense tracking", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Cash book and bank book", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Accounts receivable and payable", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Full accounting ledger", values: { "retail-starter": "no", "retail-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Reports",
      rows: [
        { label: "Daily sales summary", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Advanced sales and profit reports", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
        { label: "Custom dashboards", values: { "retail-starter": "no", "retail-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Online ordering",
      rows: [
        { label: "Branded website with CMS and catalogue", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE }, hint: "A full custom website is included with every package, including Starter." },
        { label: "WhatsApp contact button on the website", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Online store / e-commerce", values: { "retail-starter": A.ADDON, "retail-standard": A.ADDON }, hint: "A retail online store is a separate e-commerce build, quoted and charged separately from the package. It is not the same as restaurant online ordering." },
        { label: "WhatsApp ordering integration", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE }, hint: "Starter includes a WhatsApp contact button only. Full ordering through WhatsApp starts at Standard." },
      ],
    },
    {
      title: "Multi-location",
      rows: [
        { label: "Additional outlets", values: { "retail-starter": "no", "retail-standard": A.VERIFICATION } },
        { label: "Consolidated group reporting", values: { "retail-starter": "no", "retail-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Integrations",
      rows: [
        { label: "Cash and QR payment recording", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Payment gateway (automated settlement)", values: { "retail-starter": A.VERIFICATION, "retail-standard": A.VERIFICATION } },
        { label: "SMS notifications", values: { "retail-starter": A.ADDON, "retail-standard": A.ADDON } },
      ],
    },
    {
      title: "Security",
      rows: [
        { label: "User login and access control", values: { "retail-starter": A.LIMITED, "retail-standard": A.AVAILABLE } },
        { label: "Data backup", values: { "retail-starter": A.LIMITED, "retail-standard": A.AVAILABLE }, hint: "Starter includes hosting-level backup. Standard adds scheduled restorable backups." },
        { label: "Complete audit trails", values: { "retail-starter": "no", "retail-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Compliance",
      rows: [
        { label: "VAT-inclusive billing display", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "IRD / CBMS integration", values: { "retail-starter": A.VERIFICATION, "retail-standard": A.VERIFICATION } },
      ],
    },
    {
      title: "Support",
      rows: [
        { label: "Onboarding and setup", values: { "retail-starter": A.LIMITED, "retail-standard": A.AVAILABLE } },
        { label: "Remote support", values: { "retail-starter": A.AVAILABLE, "retail-standard": A.AVAILABLE } },
        { label: "Priority response", values: { "retail-starter": "no", "retail-standard": A.AVAILABLE } },
      ],
    },
  ],

  restaurant: [
    {
      title: "Core POS",
      rows: [
        { label: "Restaurant billing screen", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Receipt printing", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Business-day closing", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Discounts and service charge", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Orders",
      rows: [
        { label: "Dine-in", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Takeaway", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Delivery orders", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Split-payment allocation", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE }, hint: "Splits a bill across multiple payment methods. Split-by-seat and split-by-item are planned." },
        { label: "Split by seat or by item", values: { "restaurant-starter": "no", "restaurant-standard": A.PLANNED } },
      ],
    },
    {
      title: "Tables and reservations",
      rows: [
        { label: "Basic table management", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Floor plan and multi-floor", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Table transfer and merge", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Table reservations", values: { "restaurant-starter": "no", "restaurant-standard": A.PLANNED } },
      ],
    },
    {
      title: "Kitchen operations",
      rows: [
        { label: "KOT printing", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Kitchen display system (KDS)", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "KOT preparation-time analytics", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Multiple kitchen stations", values: { "restaurant-starter": "no", "restaurant-standard": A.LIMITED } },
      ],
    },
    {
      title: "Menu and products",
      rows: [
        { label: "Menu and category management", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Recipe and ingredient management", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Variants and modifiers", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Inventory",
      rows: [
        { label: "Basic stock tracking", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Automatic ingredient deduction", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Wastage and spoilage tracking", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Low-stock alerts", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Purchases and suppliers",
      rows: [
        { label: "Supplier records", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Purchase entry", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Supplier payables", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Staff and payroll",
      rows: [
        { label: "Staff accounts", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE }, hint: "Starter: up to 3 accounts. Standard: up to 10." },
        { label: "Roles and permissions", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Payroll and salary advances", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Attendance and shifts", values: { "restaurant-starter": A.ADDON, "restaurant-standard": A.ADDON } },
      ],
    },
    {
      title: "Customers and credit",
      rows: [
        { label: "Customer records", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Customer credit", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Loyalty programme", values: { "restaurant-starter": "no", "restaurant-standard": A.PLANNED } },
      ],
    },
    {
      title: "Accounting",
      rows: [
        { label: "Expense tracking", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Cash book and bank book", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Accounts receivable and payable", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Profit-and-loss, balance sheet, cash flow", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Reports",
      rows: [
        { label: "Daily sales report", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Kitchen and menu analytics", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Custom dashboards", values: { "restaurant-starter": "no", "restaurant-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Online ordering",
      rows: [
        { label: "QR menu", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
        { label: "Online-ordering support", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE }, hint: "Customers place orders from your menu and they arrive in the system. Included from Restaurant Standard at no extra charge." },
        { label: "Branded website with CMS and menu", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE }, hint: "A full custom website is included with every package, including Starter." },
        { label: "WhatsApp contact button on the website", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "WhatsApp ordering integration", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE }, hint: "Starter includes a WhatsApp contact button only. Full ordering through WhatsApp starts at Standard." },
      ],
    },
    {
      title: "Multi-location",
      rows: [
        { label: "Additional outlets", values: { "restaurant-starter": "no", "restaurant-standard": A.VERIFICATION } },
        { label: "Consolidated group reporting", values: { "restaurant-starter": "no", "restaurant-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Integrations",
      rows: [
        { label: "Cash and QR payment recording", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Payment gateway (automated settlement)", values: { "restaurant-starter": A.VERIFICATION, "restaurant-standard": A.VERIFICATION } },
        { label: "SMS notifications", values: { "restaurant-starter": A.ADDON, "restaurant-standard": A.ADDON } },
      ],
    },
    {
      title: "Security",
      rows: [
        { label: "User login and access control", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Data backup", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Complete audit trails", values: { "restaurant-starter": "no", "restaurant-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Compliance",
      rows: [
        { label: "VAT-inclusive billing display", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "IRD / CBMS integration", values: { "restaurant-starter": A.VERIFICATION, "restaurant-standard": A.VERIFICATION } },
      ],
    },
    {
      title: "Support",
      rows: [
        { label: "Onboarding and setup", values: { "restaurant-starter": A.LIMITED, "restaurant-standard": A.AVAILABLE } },
        { label: "Remote support", values: { "restaurant-starter": A.AVAILABLE, "restaurant-standard": A.AVAILABLE } },
        { label: "Priority response", values: { "restaurant-starter": "no", "restaurant-standard": A.AVAILABLE } },
      ],
    },
  ],

  hotel: [
    {
      title: "Core POS",
      rows: [
        { label: "Guest billing", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Payment tracking", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Additional billing controls", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Tables and reservations",
      rows: [
        { label: "Room and room-type management", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Reservation calendar", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Check-in and check-out", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Advanced reservation controls", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
        { label: "Housekeeping workflow", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
        { label: "OTA / channel-manager sync", values: { "hotel-starter": A.PLANNED, "hotel-standard": A.PLANNED } },
      ],
    },
    {
      title: "Customers and credit",
      rows: [
        { label: "Guest records", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Customer history", values: { "hotel-starter": A.LIMITED, "hotel-standard": A.AVAILABLE } },
        { label: "Accounts receivable", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Purchases and suppliers",
      rows: [
        { label: "Supplier and expense management", values: { "hotel-starter": A.LIMITED, "hotel-standard": A.AVAILABLE } },
      ],
    },
    {
      title: "Staff and payroll",
      rows: [
        { label: "Staff permissions", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Staff accounts", values: { "hotel-starter": A.LIMITED, "hotel-standard": A.AVAILABLE }, hint: "Standard includes up to 10 accounts." },
        { label: "Payroll", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
        { label: "Attendance and shifts", values: { "hotel-starter": A.ADDON, "hotel-standard": A.ADDON } },
      ],
    },
    {
      title: "Accounting",
      rows: [
        { label: "Expense tracking", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Advanced financial reports", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
        { label: "Full accounting ledger", values: { "hotel-starter": "no", "hotel-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Reports",
      rows: [
        { label: "Occupancy report", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Revenue reports", values: { "hotel-starter": A.LIMITED, "hotel-standard": A.AVAILABLE } },
        { label: "Custom dashboards", values: { "hotel-starter": "no", "hotel-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Online ordering",
      rows: [
        { label: "Custom website with CMS", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE }, hint: "A full custom website is included with every package, including Starter." },
        { label: "WhatsApp contact button on the website", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Online booking requests", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
        { label: "WhatsApp ordering integration", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE }, hint: "Starter includes a WhatsApp contact button only. Full ordering through WhatsApp starts at Standard." },
      ],
    },
    {
      title: "Multi-location",
      rows: [
        { label: "Additional properties", values: { "hotel-starter": "no", "hotel-standard": A.VERIFICATION } },
        { label: "Consolidated group reporting", values: { "hotel-starter": "no", "hotel-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Integrations",
      rows: [
        { label: "Cash and QR payment recording", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Payment gateway (automated settlement)", values: { "hotel-starter": A.VERIFICATION, "hotel-standard": A.VERIFICATION } },
        { label: "SMS notifications", values: { "hotel-starter": A.ADDON, "hotel-standard": A.ADDON } },
      ],
    },
    {
      title: "Security",
      rows: [
        { label: "User login and access control", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Data backup", values: { "hotel-starter": A.LIMITED, "hotel-standard": A.AVAILABLE } },
        { label: "Complete audit trails", values: { "hotel-starter": "no", "hotel-standard": A.ENTERPRISE } },
      ],
    },
    {
      title: "Compliance",
      rows: [
        { label: "VAT-inclusive billing display", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "IRD / CBMS integration", values: { "hotel-starter": A.VERIFICATION, "hotel-standard": A.VERIFICATION } },
      ],
    },
    {
      title: "Support",
      rows: [
        { label: "Onboarding and setup", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Remote support", values: { "hotel-starter": A.AVAILABLE, "hotel-standard": A.AVAILABLE } },
        { label: "Priority response", values: { "hotel-starter": "no", "hotel-standard": A.AVAILABLE } },
      ],
    },
  ],
}

/** Conditions shown wherever prices appear. */
export const PRICING_TERMS = [
  "Prices are in Nepalese Rupees (NPR).",
  "Prices exclude 13% VAT unless explicitly stated otherwise.",
  "One-time charges cover the agreed software licence and initial configuration.",
  "There is no annual licence renewal for the purchased version.",
  "Monthly charges cover cloud hosting, your domain, backups, maintenance and agreed support.",
  "Hardware, SMS and payment-provider charges are billed separately. Your domain is included and we pay the registrar on your behalf.",
  "Listed prices cover one outlet unless stated otherwise.",
  "Additional outlets, custom integrations and complex data migration require a quotation.",
  "New features outside the agreed package are estimated separately.",
  "Source-code ownership is not included unless explicitly stated in a signed agreement.",
  "Trial data may be reset after the evaluation period.",
  "IRD/CBMS activation is subject to technical readiness and applicable approval.",
  "Enterprise pricing varies by outlets, users, integrations and customization.",
  "A one-time licence is not lifetime free hosting, unlimited customization or unlimited support.",
]

export const SEGMENT_LABELS = {
  retail: "Retail",
  restaurant: "Restaurant",
  hotel: "Hotel",
  enterprise: "Enterprise & Custom",
}

export const packagesBySegment = (segment) => PACKAGES.filter((p) => p.segment === segment)
export const getPackage = (id) => PACKAGES.find((p) => p.id === id) || null
export const getAddOn = (id) => ADD_ONS.find((a) => a.id === id) || null

/**
 * Validate on module load.
 *
 * This lives here rather than in a barrel file because every consumer imports
 * this module directly — putting the check in an index nobody imports would
 * make it dead code. Malformed or conflicting pricing therefore fails
 * `next build` instead of shipping a wrong number to a client.
 */
const contentErrors = collectContentErrors({
  packages: PACKAGES,
  addOns: ADD_ONS,
  comparison: COMPARISON,
})

if (contentErrors.length > 0) {
  throw new Error(`Invalid website content configuration:\n  - ${contentErrors.join("\n  - ")}`)
}
