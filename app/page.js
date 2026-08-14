import Hero from "@/components/marketing/hero"
import Navbar from "@/components/marketing/navbar"
import Footer from "@/components/marketing/footer"
import SolutionCards from "@/components/marketing/solution-cards"
import FeatureTabs from "@/components/marketing/feature-tabs"
import Clients from "@/components/marketing/clients"
import { PricingTables } from "@/components/marketing/pricing"
import { WhyAadhar, HowItWorks, FAQ, FinalCTA } from "@/components/marketing/sections"
import DashboardShowcase from "@/components/marketing/dashboard-showcase"
import ProductScrollSection from "@/components/marketing/product-scroll"
import { PACKAGES } from "@/lib/content/packages"
import { schemaFaqs } from "@/lib/content/faqs"
import { SITE } from "@/lib/content/site"
import {
  pageMetadata, organizationSchema, softwareApplicationSchema, faqSchema, JsonLd,
} from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Home",
  description: SITE.description,
  path: "/",
  keywords: [
    "POS Nepal", "billing software Nepal", "restaurant POS Nepal", "retail software Nepal",
    "hotel management software Nepal", "salon software Nepal", "AADHAR POS",
  ],
})

export default function Home() {
  return (
    <>
      <JsonLd
        schema={[
          organizationSchema(),
          softwareApplicationSchema({
            name: "AADHAR POS",
            description: SITE.description,
            path: "/",
            packages: PACKAGES,
          }),
          faqSchema(schemaFaqs()),
        ]}
      />

      <Navbar />
      <main id="main" className="bg-white transition-colors duration-300 dark:bg-slate-950">
        <Hero />
        <ProductScrollSection />
        <SolutionCards />
        <DashboardShowcase />
        <FeatureTabs />
        <Clients />
        <PricingTables />
        <WhyAadhar />
        <HowItWorks />
        <FAQ limit={6} />
        <FinalCTA />
        {/*
          Add-ons, the full package comparison and the security/support detail
          live on /pricing and /features. Duplicating them here made the
          homepage twice as long without adding anything a visitor could not
          reach in one click.
        */}
      </main>
      <Footer />
    </>
  )
}
