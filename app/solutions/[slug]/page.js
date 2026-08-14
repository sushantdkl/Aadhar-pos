import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ArrowRight, AlertTriangle, Sparkles } from "lucide-react"
import PageShell, { PageHero } from "@/components/marketing/page-shell"
import { SolutionCard } from "@/components/marketing/solution-cards"
import { FinalCTA, HowItWorks, FAQ } from "@/components/marketing/sections"
import { INDUSTRIES, getIndustry } from "@/lib/content/industries"
import { getPackage } from "@/lib/content/packages"
import { npr } from "@/lib/content/format"
import { pageMetadata, breadcrumbSchema, productSchema, JsonLd } from "@/lib/seo"

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) return pageMetadata({ title: "Solution not found", description: "", path: "/solutions", noIndex: true })

  return pageMetadata({
    title: industry.name,
    description: industry.description,
    path: `/solutions/${industry.slug}`,
    keywords: [`${industry.shortName} software Nepal`, `${industry.shortName} POS Nepal`, "AADHAR"],
  })
}

export default async function IndustryPage({ params }) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) notFound()

  const pkg = industry.packageId ? getPackage(industry.packageId) : null
  const related = INDUSTRIES.filter((i) => i.slug !== industry.slug).slice(0, 3)

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
    { name: industry.name, path: `/solutions/${industry.slug}` },
  ]

  return (
    <PageShell>
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          productSchema({
            name: `AADHAR ${industry.name}`,
            description: industry.description,
            path: `/solutions/${industry.slug}`,
          }),
        ]}
      />

      <PageHero eyebrow={industry.shortName} title={industry.tagline} subtitle={industry.description} breadcrumbs={crumbs}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/get-quote?industry=${industry.slug}`}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            Request a Demo
            <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-7 py-3.5 text-base font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
          >
            Explore Interactive Demo
          </Link>
        </div>

        {industry.startingPrice && (
          <p className="mt-5 text-sm text-gray-600 dark:text-slate-400">
            From <strong className="text-gray-900 dark:text-white">{npr(industry.startingPrice.oneTime)}</strong>{" "}
            one-time +{" "}
            <strong className="text-gray-900 dark:text-white">{npr(industry.startingPrice.monthly)}/month</strong>{" "}
            hosting and maintenance. Excludes 13% VAT.
          </p>
        )}
      </PageHero>

      {/* Modules */}
      <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20" aria-labelledby="modules-heading">
        <div className="mx-auto max-w-6xl">
          <h2 id="modules-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            What is in the {industry.shortName.toLowerCase()} system
          </h2>
          <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-slate-400">
            Grouped by the part of the business each module serves.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {industry.modules.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">{group.title}</h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Honest limitations, where the industry data declares them */}
          {industry.notYetAvailable?.length > 0 && (
            <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                Not available yet
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {industry.notYetAvailable.map((note) => (
                  <li key={note} className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-gray-50 px-4 py-12 dark:bg-slate-900/50 sm:py-16 lg:py-20" aria-labelledby="outcomes-heading">
        <div className="mx-auto max-w-4xl">
          <h2 id="outcomes-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            What changes day to day
          </h2>
          <ul className="mt-8 space-y-4">
            {industry.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" aria-hidden="true" />
                <span className="text-base leading-relaxed text-gray-700 dark:text-slate-300">{outcome}</span>
              </li>
            ))}
          </ul>

          {pkg && (
            <div className="mt-10 rounded-2xl border border-orange-500/30 bg-orange-500/[0.06] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                    Recommended package
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{pkg.name}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    {pkg.quoteOnly
                      ? "Custom quotation after a requirements review"
                      : `${npr(pkg.oneTime)} one-time + ${npr(pkg.monthly)}/month`}
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/40 px-5 py-2.5 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-500/10 dark:text-orange-400"
                >
                  Compare packages
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* Related industries */}
      <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16 lg:py-20" aria-labelledby="related-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="related-heading" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Other industries we build for
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <SolutionCard key={r.slug} industry={r} index={i} />
            ))}
          </div>
          <p className="mt-8">
            <Link
              href="/solutions"
              className="text-sm font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
            >
              View all solutions →
            </Link>
          </p>
        </div>
      </section>

      <FAQ limit={6} />
      <FinalCTA
        title={`Ready to see the ${industry.shortName.toLowerCase()} system with your own data?`}
        subtitle="Tell us how your business runs and we will configure the evaluation environment around it."
      />
    </PageShell>
  )
}
