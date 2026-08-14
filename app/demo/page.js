import Link from "next/link"
import { Info, ArrowRight } from "lucide-react"
import PageShell, { PageHero } from "@/components/marketing/page-shell"
import ProductDashboard from "@/components/marketing/product-dashboard"
import { HowItWorks, FinalCTA } from "@/components/marketing/sections"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Interactive Demo",
  description:
    "Explore an interactive preview of the AADHAR dashboard — sales, profit, inventory, staff, accounting and reports — with demonstration data for restaurant, retail and salon businesses.",
  path: "/demo",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Interactive Demo", path: "/demo" },
]

export default function DemoPage() {
  return (
    <PageShell>
      <JsonLd schema={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Interactive Demo"
        title="Click through the system before you talk to anyone."
        subtitle="This is a live, interactive preview built from the same interface patterns as the product. Switch industry, change the date range and move between sections — the figures update as you go."
        breadcrumbs={crumbs}
      >
        <div className="flex items-start gap-3 rounded-xl border border-sky-500/25 bg-sky-500/[0.07] p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
            <strong className="text-gray-900 dark:text-white">
              Interactive product preview with demonstration data.
            </strong>{" "}
            All figures below are synthetic samples. This preview is not connected to any client database
            and never displays live business data. To see the real application running with your own
            products or menu, request a demo — we will configure an evaluation environment for you.
          </p>
        </div>
      </PageHero>

      <section className="bg-gray-50 px-4 py-14 dark:bg-slate-900/50 sm:py-16" aria-labelledby="preview-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="preview-heading" className="sr-only">
            Interactive dashboard preview
          </h2>
          <ProductDashboard />
        </div>
      </section>

      {/* What you can try */}
      <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20" aria-labelledby="try-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="try-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Things worth trying in the preview
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Switch the industry",
                body: "Move between Restaurant, Retail and Salon. The terminology, categories and figures all change — this is the same platform configured differently.",
              },
              {
                title: "Change the date range",
                body: "Today, week, month and quarter each recalculate every figure on the dashboard, including profit margin and expected cash.",
              },
              {
                title: "Open IRD Billing",
                body: "It is marked Verification Pending, because integration depends on technical verification and an approval process we do not claim to have completed.",
              },
              {
                title: "Look at the audit alerts",
                body: "Bills edited after printing, large discounts and post-payment voids are surfaced rather than buried — that is the point of the audit record.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{item.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-orange-500/30 bg-orange-500/[0.06] p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Want to try the real application?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              We set up a separate evaluation environment configured with your own menu or product list.
              It is isolated from every other client&apos;s data, and you use it free for 15 days before
              deciding.
            </p>
            <Link
              href="/get-quote"
              className="group mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              Request Your Evaluation Environment
              <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <FinalCTA />
    </PageShell>
  )
}
