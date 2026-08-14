import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import PageShell, { PageHero } from "@/components/marketing/page-shell"
import Clients from "@/components/marketing/clients"
import { WhyAadhar, SecurityAndSupport, FinalCTA } from "@/components/marketing/sections"
import { INDUSTRIES } from "@/lib/content/industries"
import { CONTACT } from "@/lib/content/site"
import { pageMetadata, breadcrumbSchema, organizationSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "About AADHAR",
  description:
    "AADHAR builds industry-specific business software for Nepali businesses — restaurants, retail, hotels, salons, travel agencies and event venues. How we work, what we promise, and what we deliberately do not claim.",
  path: "/about",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
]

const PRINCIPLES = [
  {
    title: "We describe the product as it is today",
    body: "Every capability on this website carries a status: included, limited, an optional add-on, enterprise scope, planned, or subject to verification. If something is not built yet, it says so.",
  },
  {
    title: "We do not publish numbers we cannot substantiate",
    body: "No invented testimonials, no stock-photo customers, no “10 million transactions”, no certification badges we do not hold. If you see a figure on this site, we can show you where it comes from.",
  },
  {
    title: "You test before you pay",
    body: "A 15-day no-obligation evaluation on an environment configured for your business. The one-time software charge becomes payable only after you approve the system.",
  },
  {
    title: "Pricing is stated in full",
    body: "A one-time licence and a monthly service, listed separately, in NPR, with VAT and third-party charges called out. No annual licence renewal, and we say plainly what the monthly fee buys.",
  },
  {
    title: "We stay in scope",
    body: "Work outside the agreed package is estimated separately and agreed in writing before it starts, rather than absorbed quietly or invoiced as a surprise.",
  },
  {
    title: "Your data belongs to you",
    body: "Business data is yours and can be exported. Source-code ownership is separate and only transfers under a signed agreement — we do not blur the two.",
  },
]

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd schema={[breadcrumbSchema(crumbs), organizationSchema()]} />

      <PageHero
        eyebrow="About Us"
        title="We build business software for Nepal, in Nepal."
        subtitle="AADHAR started from a simple observation: most business software sold here is either a foreign product with the currency changed, or a single generic billing screen sold to every kind of business. Neither fits how a Nepali restaurant, shop, salon or venue actually operates."
        breadcrumbs={crumbs}
      />

      {/* What we do */}
      <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20" aria-labelledby="what-heading">
        <div className="mx-auto max-w-4xl">
          <h2 id="what-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            What we do
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600 dark:text-slate-400">
            <p>
              We build and deliver industry-specific business systems — billing, operations, inventory,
              staff, accounting and reporting — configured around the way a particular kind of business
              works. A restaurant needs kitchen tickets, recipe costing and table management. A salon needs
              a token queue, staff commission and package tracking. A venue needs a booking calendar that
              cannot double-book a hall. They are not the same product with a different logo.
            </p>
            <p>
              Underneath, they share one platform. That is what lets us configure a system for a new
              industry without starting from scratch, and it is why we can take on custom work for
              businesses that do not fit any standard package.
            </p>
            <p>
              We work with businesses across {INDUSTRIES.length} industry lines today, and we are
              deliberately careful about which capabilities we advertise as ready. You will find things on
              this site marked <em>planned</em> or <em>pending verification</em>. That is on purpose.
            </p>
          </div>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {INDUSTRIES.map((industry) => (
              <li key={industry.slug}>
                <Link
                  href={`/solutions/${industry.slug}`}
                  className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
                >
                  <Check className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  {industry.name}
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-gray-50 px-4 py-12 dark:bg-slate-900/50 sm:py-16 lg:py-20" aria-labelledby="principles-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="principles-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            How we work
          </h2>
          <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-slate-400">
            These are commitments you can hold us to, not marketing lines.
          </p>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WhyAadhar />
      <Clients showFilters={false} limit={6} eyebrow="Track Record" title="Businesses running our systems today." />
      <SecurityAndSupport />

      {/* Contact strip */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-slate-900/50" aria-labelledby="reach-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="reach-heading" className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Talk to the people who build it
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
            We are a small team, which means the person who scopes your system is usually the person who
            configures it. Reach us at{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
              {CONTACT.email}
            </a>{" "}
            or{" "}
            <a href={`tel:${CONTACT.phone}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
              {CONTACT.phoneDisplay}
            </a>
            , {CONTACT.hours}.
          </p>
        </div>
      </section>

      <FinalCTA />
    </PageShell>
  )
}
