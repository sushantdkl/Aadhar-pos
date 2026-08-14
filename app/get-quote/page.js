import { Suspense } from "react"
import { Phone, Mail, Clock, ShieldCheck } from "lucide-react"
import PageShell, { PageHero } from "@/components/marketing/page-shell"
import QuoteFormSection from "./quote-form-section"
import { CONTACT, EVALUATION } from "@/lib/content/site"
import { PROCESS_STEPS } from "@/lib/content/process"
import { pageMetadata, breadcrumbSchema, JsonLd } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Get a Quote",
  description:
    "Request a written quotation for AADHAR business software. Tell us your industry, outlets, users and required modules, and we will send a costed proposal — with a 15-day no-obligation evaluation.",
  path: "/get-quote",
})

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Get a Quote", path: "/get-quote" },
]

export default function GetQuotePage() {
  return (
    <PageShell>
      <JsonLd schema={breadcrumbSchema(crumbs)} />

      <PageHero
        eyebrow="Get a Quote"
        title="Tell us how your business runs. We will price it honestly."
        subtitle="The more you tell us here, the more accurate the quotation. Nothing on this form commits you to anything — and we will not pass your details to anyone else."
        breadcrumbs={crumbs}
      />

      <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
              <Suspense
                fallback={
                  <div className="py-12 text-center text-sm text-gray-500 dark:text-slate-500">
                    Loading form…
                  </div>
                }
              >
                <QuoteFormSection />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                No obligation
              </h2>
              <ul className="mt-3 space-y-2">
                {EVALUATION.points.map((p) => (
                  <li key={p} className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                    • {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">What happens next</h2>
              <ol className="mt-3 space-y-3">
                {PROCESS_STEPS.map((step) => (
                  <li key={step.number} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                      {step.number}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Prefer to talk?</h2>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="inline-flex items-center gap-2 text-gray-700 transition-colors hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 break-all text-gray-700 transition-colors hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-slate-400">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                  <span className="text-xs leading-relaxed">{CONTACT.hours}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  )
}
