/**
 * Real client deployments.
 *
 * Rules enforced by this file:
 *  - Only real businesses that AADHAR has actually delivered a system for.
 *  - `logo` stays null until a real logo asset exists and permission is on file;
 *    the UI renders a text-based client card instead. Never a stock photograph.
 *  - No testimonials, ratings, revenue figures or usage statistics are stored
 *    here. Add a `testimonial` only when it is a real, attributable, approved
 *    quote from the client.
 *  - `caseStudyHref` stays null until a real case study page exists, so the
 *    button is never rendered as a dead link.
 *  - `website` is the client's live public site where we built one. Every URL
 *    here must be verified reachable before it is added — a dead link on a
 *    client card is worse than no link. Null where there is no public site.
 */

export const CLIENT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "restaurant", label: "Restaurant" },
  { id: "retail", label: "Retail" },
  { id: "salon", label: "Salon" },
  { id: "travel", label: "Travel" },
  { id: "events", label: "Events" },
  { id: "custom", label: "Custom" },
]

export const CLIENTS = [
  {
    id: "the-haircut",
    name: "The Haircut",
    category: "salon",
    categoryLabel: "Salon",
    solution: "Salon POS and management system",
    summary:
      "Token queue, service billing by staff member, commission and salary handling, and product stock in one system.",
    location: "Nepal",
    status: "live",
    logo: "/clients/the-haircut.png",
    website: "https://thehaircut.com.np/",
    caseStudyHref: null,
    testimonial: null,
  },
  {
    id: "bheri-karnali",
    name: "Bheri Karnali Tours & Travels",
    category: "travel",
    categoryLabel: "Tour & Travel",
    solution: "Booking, inquiries and travel-management system",
    summary:
      "Tour packages, destination content, vehicle and booking inquiries, with a website CMS the team manages themselves.",
    location: "Birendranagar, Surkhet",
    status: "live",
    logo: "/clients/bheri-karnali.jpeg",
    website: null,
    caseStudyHref: null,
    testimonial: null,
  },
  {
    id: "kathmandu-momo",
    name: "Kathmandu Momo",
    category: "restaurant",
    categoryLabel: "Restaurant",
    solution: "Restaurant POS and management",
    summary: "Dine-in and takeaway billing with KOT printing, menu management and daily sales reporting.",
    location: "Kathmandu",
    status: "live",
    logo: "/clients/kathmandu-momo.png",
    website: "https://kathmandumomorestaurant.com/",
    caseStudyHref: null,
    testimonial: null,
  },
  {
    id: "dim-sum-puri",
    name: "Dim Sum Puri",
    category: "restaurant",
    categoryLabel: "Restaurant",
    solution: "Restaurant POS, ordering and billing",
    summary: "Order flow from counter to kitchen, table management and billing with payment-method breakdown.",
    location: "Birendranagar-6, Surkhet",
    status: "live",
    logo: "/clients/dim-sum-puri.jpeg",
    website: "https://dimsumpuri.com.np/",
    caseStudyHref: null,
    testimonial: null,
  },
  {
    id: "raithane-daure-chulo",
    name: "Raithane Daure Chulo",
    category: "restaurant",
    categoryLabel: "Restaurant",
    solution: "Restaurant operations and compliance-stage POS",
    summary:
      "Restaurant operations with billing controls prepared for tax compliance. Compliance activation is subject to verification and approval.",
    location: "Nepal",
    status: "compliance-stage",
    logo: null,
    website: null,
    caseStudyHref: null,
    testimonial: null,
  },
  {
    id: "sundar-bagaicha",
    name: "Sundar Bagaicha Events",
    category: "events",
    categoryLabel: "Event & Venue",
    solution: "Event and venue-management solution",
    summary: "Hall and booking calendar, event packages, advance and balance payment tracking, and invoicing.",
    location: "Nepal",
    status: "live",
    logo: "/clients/sundar-bagaicha.jpeg",
    website: "https://sundarbagaichaevents.com.np/",
    caseStudyHref: null,
    testimonial: null,
  },
]

export const CLIENT_STATUS_META = {
  live: { label: "Live", tone: "positive" },
  "compliance-stage": { label: "Compliance stage", tone: "pending" },
  onboarding: { label: "Onboarding", tone: "pending" },
}

/** Shown after the client grid — an honest forward-looking note, not a statistic. */
export const CLIENTS_FOOTNOTE =
  "More restaurants, retailers, hotels and service businesses are currently onboarding. Client names are published only with permission."

export const clientsByCategory = (category) =>
  category === "all" ? CLIENTS : CLIENTS.filter((c) => c.category === category)
