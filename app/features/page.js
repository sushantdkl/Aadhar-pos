import PageShell, { PageHero } from "@/components/marketing/page-shell"
import FeatureTabs from "@/components/marketing/feature-tabs"
import ComparisonTable from "@/components/marketing/comparison-table"
import { WhyAadhar, SecurityAndSupport, FinalCTA, FAQ } from "@/components/marketing/sections"
import { PACKAGES } from "@/lib/content/packages"
import { pageMetadata, breadcrumbSchema, softwareApplicationSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Features",
  description:
    "Every AADHAR capability — POS and billing, orders and tables, kitchen operations, inventory, staff and payroll, customers, accounting, reports, online ordering and security — labelled as available, add-on, enterprise, planned or pending verification.",
  path: "/features",
  keywords: ["POS features", "restaurant billing software", "inventory management Nepal"],
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
]

export default function FeaturesPage() {
  return (
    <PageShell>
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: "AADHAR POS",
            description:
              "Business management software for restaurants, retail, hotels, salons, travel agencies and event venues in Nepal.",
            path: "/features",
            packages: PACKAGES,
          }),
        ]}
      />

      <PageHero
        eyebrow="Product Capabilities"
        title="What the system does — and what it does not do yet."
        subtitle="Most software vendors list every feature they can imagine. We list ours with a status attached, so you can tell the difference between what ships today, what costs extra, what needs an approval process, and what is still planned."
        breadcrumbs={crumbs}
      />

      <FeatureTabs />
      <ComparisonTable />
      <WhyAadhar />
      <SecurityAndSupport />
      <FAQ limit={8} />
      <FinalCTA />
    </PageShell>
  )
}
