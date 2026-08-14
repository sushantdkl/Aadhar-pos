import PageShell, { PageHero } from "@/components/marketing/page-shell"
import SolutionCards from "@/components/marketing/solution-cards"
import { FinalCTA, HowItWorks } from "@/components/marketing/sections"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Industry Solutions",
  description:
    "Industry-specific business systems for restaurants, retail stores, hotels, salons, travel agencies and event venues in Nepal — plus custom software when no standard package fits.",
  path: "/solutions",
  keywords: ["POS Nepal", "restaurant software Nepal", "retail billing Nepal", "hotel software Nepal"],
})

export default function SolutionsPage() {
  return (
    <PageShell>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />

      <PageHero
        eyebrow="Solutions"
        title="A system shaped by your industry, not a template with your logo on it."
        subtitle="AADHAR is not one generic POS screen. It is a flexible business platform we configure around how each kind of business actually operates — the orders it takes, the stock it moves, the staff it pays and the reports its owner needs."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ]}
      />

      <SolutionCards
        eyebrow="Choose your industry"
        title="Seven starting points. One platform underneath."
        subtitle="Each solution shares the same core — billing, inventory, staff, accounting and reporting — with the modules and terminology that industry actually uses."
      />

      <HowItWorks />
      <FinalCTA />
    </PageShell>
  )
}
