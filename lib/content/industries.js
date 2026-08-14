/**
 * Industry solutions. One entry per /solutions/[slug] route.
 * `features` are the six headline capabilities shown on the solution card;
 * `modules` is the full grouped breakdown used on the detail page.
 */

export const INDUSTRIES = [
  {
    slug: "restaurant",
    name: "Restaurant POS",
    shortName: "Restaurant",
    tagline: "From the first KOT to the closing balance.",
    description:
      "Run dine-in, takeaway and delivery from one screen. Orders flow to the kitchen, ingredients come off stock automatically, and the day closes with numbers you can act on.",
    accent: "orange",
    icon: "utensils",
    video: "/Scan Matrix.webm",
    startingPrice: { oneTime: 20000, monthly: 1000 },
    packageId: "restaurant-standard",
    features: [
      "Dine-in, takeaway and delivery",
      "Table and floor management",
      "KOT and kitchen display",
      "Recipe and ingredient stock deduction",
      "Purchases, suppliers and wastage",
      "Sales and kitchen analytics",
    ],
    modules: [
      {
        title: "Orders and service",
        items: [
          "Dine-in, takeaway and delivery",
          "Table and floor management",
          "KOT and kitchen display",
          "Split payments across methods",
        ],
      },
      {
        title: "Menu and stock",
        items: [
          "Menu and recipe management",
          "Ingredient stock deduction",
          "Purchases and suppliers",
          "Wastage monitoring",
        ],
      },
      {
        title: "Money and reporting",
        items: [
          "Customer credit",
          "Expenses and accounting",
          "QR menu and online ordering",
          "Sales and kitchen analytics",
        ],
      },
    ],
    outcomes: [
      "Kitchen tickets stop getting lost between the counter and the pass.",
      "Ingredient stock reflects what was actually sold, without a manual count.",
      "You can see gross profit per menu item, not just total sales.",
    ],
  },
  {
    slug: "retail",
    name: "Retail POS",
    shortName: "Retail",
    tagline: "Fast at the counter, honest in the books.",
    description:
      "Scan, bill and print in seconds. Behind the counter you get real stock levels, supplier balances, customer credit and a daily close that actually reconciles.",
    accent: "amber",
    icon: "store",
    video: "/Inventory.webm",
    startingPrice: { oneTime: 15000, monthly: 1000 },
    packageId: "retail-standard",
    features: [
      "Fast billing with barcode support",
      "Product, category and pricing control",
      "Stock tracking and low-stock alerts",
      "Purchases and supplier balances",
      "Customer credit and receivables",
      "Sales reports and business-day closing",
    ],
    modules: [
      {
        title: "Counter",
        items: [
          "Fast billing",
          "Product and barcode management",
          "Categories and pricing",
          "Receipt printing",
        ],
      },
      {
        title: "Stock and suppliers",
        items: ["Stock tracking", "Purchases and suppliers", "Low-stock alerts", "Stock adjustments"],
      },
      {
        title: "Money and control",
        items: [
          "Customer credit",
          "Expenses",
          "Cash and digital payments",
          "Sales reports",
          "User permissions",
          "Business-day closing",
        ],
      },
    ],
    outcomes: [
      "Billing keeps pace with a queue instead of slowing it down.",
      "Stock on the screen matches stock on the shelf.",
      "Udhaaro is tracked per customer instead of in a notebook.",
    ],
  },
  {
    slug: "hotel",
    name: "Hotel Software",
    shortName: "Hotel",
    tagline: "Rooms, guests and revenue in one view.",
    description:
      "Manage room inventory, reservations and guest billing without a spreadsheet. Housekeeping status and occupancy reporting keep the front desk and the floor in sync.",
    accent: "orange",
    icon: "bed",
    video: "/cloud.webm",
    startingPrice: { oneTime: 30000, monthly: 1500 },
    packageId: "hotel-standard",
    features: [
      "Room and room-type management",
      "Reservation calendar",
      "Check-in and check-out",
      "Guest records and history",
      "Housekeeping status",
      "Occupancy and revenue reports",
    ],
    modules: [
      {
        title: "Front desk",
        items: [
          "Room and room-type management",
          "Reservation calendar",
          "Guest records",
          "Check-in and check-out",
        ],
      },
      {
        title: "Operations",
        items: ["Housekeeping status", "Staff permissions", "Expense tracking", "Customer history"],
      },
      {
        title: "Revenue",
        items: ["Billing and payment tracking", "Occupancy and revenue reports"],
      },
    ],
    outcomes: [
      "The reservation calendar is the single source of truth for availability.",
      "Housekeeping status is visible to the front desk in real time.",
      "Occupancy and revenue are reported from actual bookings.",
    ],
    // Honest disclosure: this product line is the newest, so state what is not yet in it.
    notYetAvailable: [
      "OTA and channel-manager synchronization is planned and not currently available.",
      "Multi-property management is quoted after branch isolation is verified for your setup.",
    ],
  },
  {
    slug: "salon",
    name: "Salon POS",
    shortName: "Salon",
    tagline: "Queue, chair, commission and payout.",
    description:
      "Built for salons and barbershops: token queues, service billing per staff member, commission and salary handling, product stock and a customer history that follows the client.",
    accent: "amber",
    icon: "scissors",
    video: "/Form filling.webm",
    startingPrice: { oneTime: 30000, monthly: 1000 },
    packageId: null,
    quoteOnly: true,
    features: [
      "Token and queue management",
      "Service billing and staff assignment",
      "Staff commission and salary handling",
      "Packages and service catalogue",
      "Customer history and appointments",
      "Performance reports",
    ],
    modules: [
      {
        title: "Floor",
        items: [
          "Token and queue management",
          "Service billing",
          "Staff assignment",
          "Appointment requests",
        ],
      },
      {
        title: "Staff",
        items: ["Staff commission", "Salary and advance salary", "Performance reports"],
      },
      {
        title: "Clients and catalogue",
        items: [
          "Product inventory",
          "Customer history",
          "Packages and services",
          "Split cash and QR payments",
          "Website CMS and booking",
        ],
      },
    ],
    outcomes: [
      "Every service is attributed to the staff member who performed it.",
      "Commission and advances are calculated from real billing, not memory.",
      "Returning clients arrive with their history already on screen.",
    ],
  },
  {
    slug: "tour-travel",
    name: "Tour & Travel",
    shortName: "Travel",
    tagline: "From inquiry to confirmed booking.",
    description:
      "Manage tour packages, destinations and vehicle inquiries, capture leads from your website and WhatsApp, and track payments through to departure.",
    accent: "orange",
    icon: "map",
    video: "/multichannel.webm",
    startingPrice: { oneTime: 25000, monthly: 1000 },
    packageId: null,
    quoteOnly: true,
    features: [
      "Tour-package and destination management",
      "Vehicle and booking inquiries",
      "Customer inquiry and lead tracking",
      "Payment tracking",
      "Website CMS with gallery management",
      "WhatsApp communication",
    ],
    modules: [
      {
        title: "Products",
        items: ["Tour-package management", "Destination management", "Vehicle inquiries"],
      },
      {
        title: "Demand",
        items: [
          "Booking requests",
          "Customer inquiries",
          "WhatsApp communication",
          "Reports and lead tracking",
        ],
      },
      {
        title: "Web presence",
        items: ["Website CMS", "Image and gallery management", "Payment tracking"],
      },
    ],
    outcomes: [
      "Website inquiries land in one place instead of scattered inboxes.",
      "Package content and gallery images are edited without a developer.",
      "Advance and balance payments are tracked against each booking.",
    ],
  },
  {
    slug: "event-venue",
    name: "Event & Venue Software",
    shortName: "Events",
    tagline: "One calendar for every hall and every booking.",
    description:
      "For party palaces, banquet halls and event venues: hall inventory, a booking calendar that prevents double-booking, event packages, staged payments and invoicing.",
    accent: "amber",
    icon: "calendar",
    video: "/finance graphs.webm",
    startingPrice: { oneTime: 25000, monthly: 1000 },
    packageId: null,
    quoteOnly: true,
    features: [
      "Venue and hall management",
      "Booking calendar",
      "Event-package management",
      "Advance and remaining payments",
      "Resource allocation and invoicing",
      "Booking status and event reports",
    ],
    modules: [
      {
        title: "Venue",
        items: ["Venue and hall management", "Booking calendar", "Resource allocation"],
      },
      {
        title: "Bookings",
        items: [
          "Event-package management",
          "Customer records",
          "Booking status",
        ],
      },
      {
        title: "Money",
        items: ["Advance and remaining payments", "Invoicing", "Expense tracking", "Event reports"],
      },
    ],
    outcomes: [
      "Two events can no longer be booked into the same hall on the same date.",
      "Advance received and balance due are visible per booking.",
      "Event packages are priced consistently instead of negotiated from scratch.",
    ],
  },
  {
    slug: "custom-software",
    name: "Custom Ordering Software",
    shortName: "Custom",
    tagline: "When no standard package fits the business.",
    description:
      "Some businesses do not fit a template. We build tailored ordering, billing, inventory, CMS and management systems around the way your operation actually runs — scoped, quoted and delivered in defined stages.",
    accent: "orange",
    icon: "settings",
    video: "/Work flow Gear Animation.webm",
    startingPrice: null,
    packageId: "enterprise",
    quoteOnly: true,
    features: [
      "Requirement study of your real workflow",
      "Custom ordering and billing flows",
      "Inventory and purchase logic to match your operation",
      "Website and CMS where the business needs one",
      "Role-based management and approval workflows",
      "Reporting designed around your decisions",
    ],
    modules: [
      {
        title: "Discovery",
        items: [
          "Workflow and role mapping",
          "Hardware and printing requirements",
          "Reporting and approval requirements",
        ],
      },
      {
        title: "Build",
        items: [
          "Custom ordering and billing",
          "Inventory and purchase logic",
          "Website, CMS and integrations",
        ],
      },
      {
        title: "Delivery",
        items: [
          "Data migration",
          "Staff training",
          "Staged rollout and support",
        ],
      },
    ],
    outcomes: [
      "The system matches your process instead of forcing you to change it.",
      "Scope, stages and cost are agreed in writing before development starts.",
      "You get a named point of contact through delivery.",
    ],
  },
]

export const getIndustry = (slug) => INDUSTRIES.find((i) => i.slug === slug) || null
export const industrySlugs = () => INDUSTRIES.map((i) => i.slug)
