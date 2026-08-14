import Link from "next/link"
import PageShell, { PageHero } from "@/components/marketing/page-shell"
import Clients from "@/components/marketing/clients"
import { FinalCTA } from "@/components/marketing/sections"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Clients",
  description:
    "Real businesses running systems AADHAR built — restaurants, a salon, a tour and travel agency and an event venue in Nepal. Published with permission, with no invented testimonials or statistics.",
  path: "/clients",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Clients", path: "/clients" },
]

export default function ClientsPage() {
  return (
    <PageShell>
      <JsonLd schema={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Our Clients"
        title="Solutions delivered for real businesses."
        subtitle="These are businesses running systems we built and delivered. We publish a client's name only with their permission — and we do not publish testimonials, star ratings, revenue improvements or usage statistics that we cannot substantiate."
        breadcrumbs={crumbs}
      />

      <Clients
        eyebrow="Delivered"
        title="Who we work with"
        subtitle="Filter by industry to see the kind of system we build for businesses like yours."
      />

      {/* Honest note about what is deliberately absent from this page */}
      <section className="bg-white px-4 py-16 dark:bg-slate-950" aria-labelledby="integrity-heading">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-7 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 id="integrity-heading" className="text-lg font-bold text-gray-900 dark:text-white">
            Why you will not find testimonials or statistics here
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
            A lot of software websites in this market publish glowing quotes with stock photographs
            attached, alongside numbers like &ldquo;profit up 17%&rdquo;. We do not, because we cannot
            substantiate them. When a client agrees to give us a real, attributable quote or lets us
            publish a measured result, we will put it here with their name on it — and not before.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
            If you would like to speak to an existing client before deciding, ask us. We will arrange an
            introduction where the client is willing.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
          >
            Request a client reference →
          </Link>
        </div>
      </section>

      <FinalCTA
        title="Want your business on this page?"
        subtitle="Start with a demo and a 15-day evaluation. If the system fits, we will build it around your operation."
      />
    </PageShell>
  )
}
