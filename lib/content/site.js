/**
 * Central site configuration: brand, contact details, navigation, social links.
 * Edit values here rather than inside presentation components.
 */

export const SITE = {
  name: "AADHAR",
  legalName: "AADHAR",
  productName: "AADHAR POS",
  tagline: "Business software built around how you actually work.",
  description:
    "AADHAR builds industry-specific billing, inventory, operations and reporting systems for restaurants, retail stores, hotels, salons, travel agencies and event venues in Nepal.",
  // Used for canonical URLs, sitemap and Open Graph. Override with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aadharpos.com",
  locale: "en_NP",
  country: "Nepal",
  currency: "NPR",
  ogImage: "/FULL_LOGO_NAME+ICON.png",
}

export const CONTACT = {
  email: "info@aadharpos.com",
  supportEmail: "support@aadharpos.com",
  phone: "+977-9766209824",
  phoneDisplay: "+977 9766209824",
  whatsapp: "+9779766209824",
  address: {
    line1: "Kathmandu",
    city: "Kathmandu",
    country: "Nepal",
  },
  // Support hours as actually offered. Do not advertise 24/7 unless staffed 24/7.
  hours: "Sunday – Friday, 9:00 AM – 6:00 PM (NPT)",
}

/**
 * Social links. Set `enabled: false` for any profile that does not exist yet —
 * disabled entries are not rendered, which keeps dead links off the site.
 */
export const SOCIAL = [
  { name: "Facebook", href: "https://facebook.com/aadharpos", icon: "facebook", enabled: true },
  { name: "Instagram", href: "https://instagram.com/aadharpos", icon: "instagram", enabled: true },
  { name: "LinkedIn", href: "https://linkedin.com/company/aadharpos", icon: "linkedin", enabled: true },
  { name: "WhatsApp", href: `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`, icon: "whatsapp", enabled: true },
]

export const enabledSocial = () => SOCIAL.filter((s) => s.enabled)

/** Primary navigation. `children` renders a dropdown on desktop and a group on mobile. */
export const NAV = [
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Restaurant POS", href: "/solutions/restaurant", desc: "Dine-in, takeaway, delivery, KOT and recipe control" },
      { label: "Retail POS", href: "/solutions/retail", desc: "Fast billing, barcodes, stock and supplier management" },
      { label: "Hotel Software", href: "/solutions/hotel", desc: "Rooms, reservations, check-in/out and housekeeping" },
      { label: "Salon POS", href: "/solutions/salon", desc: "Tokens, staff commission, packages and appointments" },
      { label: "Tour & Travel", href: "/solutions/tour-travel", desc: "Packages, inquiries, bookings and website CMS" },
      { label: "Event & Venue", href: "/solutions/event-venue", desc: "Halls, booking calendar, packages and invoicing" },
      { label: "Custom Software", href: "/solutions/custom-software", desc: "Tailored ordering and management systems" },
    ],
  },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Clients", href: "/clients" },
  { label: "Interactive Demo", href: "/demo" },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About AADHAR", href: "/about", desc: "Who we are and how we work" },
      { label: "Contact", href: "/contact", desc: "Talk to our team" },
      { label: "Documentation", href: "/docs", desc: "Product manual and setup guides" },
      { label: "Blog", href: "/blog", desc: "Product notes and updates" },
      { label: "Careers", href: "/careers", desc: "Open roles at AADHAR" },
    ],
  },
]

export const PRIMARY_CTA = { label: "Get a Quote", href: "/get-quote" }
export const SECONDARY_CTA = { label: "Interactive Demo", href: "/demo" }

export const FOOTER_NAV = [
  {
    title: "Solutions",
    links: [
      { label: "Restaurant POS", href: "/solutions/restaurant" },
      { label: "Retail POS", href: "/solutions/retail" },
      { label: "Hotel Software", href: "/solutions/hotel" },
      { label: "Salon POS", href: "/solutions/salon" },
      { label: "Tour & Travel", href: "/solutions/tour-travel" },
      { label: "Event & Venue", href: "/solutions/event-venue" },
      { label: "Custom Software", href: "/solutions/custom-software" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "All Features", href: "/features" },
      { label: "Pricing & Packages", href: "/pricing" },
      { label: "Interactive Demo", href: "/demo" },
      { label: "Documentation", href: "/docs" },
      { label: "Get a Quote", href: "/get-quote" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Clients", href: "/clients" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Service Policy", href: "/service-policy" },
    ],
  },
]

/**
 * Commercial evaluation terms. Referenced by hero, pricing, FAQ and legal pages
 * so the offer is described identically everywhere.
 */
export const EVALUATION = {
  days: 15,
  headline: "15-day no-obligation evaluation. Pay only after you approve the system.",
  points: [
    "Every client gets a 15-day no-obligation evaluation period.",
    "If you accept the system, the remainder of the first 30 days of hosting and support is included.",
    "After approval, the one-time software charge becomes payable.",
    "Monthly hosting and maintenance begins after the included first month.",
    "No credit card is required for the evaluation.",
  ],
}
