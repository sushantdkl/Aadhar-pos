import PageShell, { PageHero } from "@/components/marketing/page-shell"
import { PricingTables, AddOns, PricingTerms } from "@/components/marketing/pricing"
import ComparisonTable from "@/components/marketing/comparison-table"
import { HowItWorks, FAQ, FinalCTA } from "@/components/marketing/sections"
import { PACKAGES } from "@/lib/content/packages"
import { schemaFaqs } from "@/lib/content/faqs"
import {
  pageMetadata, breadcrumbSchema, softwareApplicationSchema, faqSchema, JsonLd,
} from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Pricing & Packages",
  description:
    "Transparent AADHAR pricing in NPR: a one-time software licence with no annual renewal, plus monthly cloud hosting and maintenance. Retail, restaurant, hotel and enterprise packages, optional add-ons and full pricing conditions.",
  path: "/pricing",
  keywords: ["POS price Nepal", "restaurant software price Nepal", "billing software cost NPR"],
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
]

export default function PricingPage() {
  return (
    <PageShell>
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: "AADHAR POS",
            description: "Business management software packages for Nepali businesses.",
            path: "/pricing",
            packages: PACKAGES,
          }),
          faqSchema(schemaFaqs()),
        ]}
      />

      <PageHero
        eyebrow="Pricing"
        title="What it costs, and what each charge is actually for."
        subtitle="Two charges, stated separately: a one-time software licence you pay once, and a monthly service covering cloud hosting, backups, maintenance and support. There is no annual licence renewal — and a one-time licence is not the same as free hosting for life."
        breadcrumbs={crumbs}
      />

      <PricingTables />
      <AddOns />
      <ComparisonTable />
      <PricingTerms />
      <HowItWorks />
      <FAQ />
      <FinalCTA
        title="Not sure which package fits?"
        subtitle="Tell us about your business and we will recommend a package and send a written quotation — with no obligation."
      />
    </PageShell>
  )
}
