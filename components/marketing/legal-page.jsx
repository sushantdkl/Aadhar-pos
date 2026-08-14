import PageShell, { PageHero } from "./page-shell"
import { CONTACT, SITE } from "@/lib/content/site"

/**
 * Shared layout for the four policy pages. Content is passed as structured
 * sections so the pages stay editable without touching presentation.
 */
export default function LegalPage({ title, intro, updated, sections, crumbs, children }) {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title={title} subtitle={intro} breadcrumbs={crumbs}>
        <p className="text-sm text-gray-500 dark:text-slate-500">Last updated: {updated}</p>
      </PageHero>

      <article className="bg-white px-4 py-12 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Contents */}
          <nav aria-label="On this page" className="mb-12 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">On this page</h2>
            <ol className="space-y-1.5">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-gray-600 underline-offset-4 transition-colors hover:text-orange-600 hover:underline dark:text-slate-400 dark:hover:text-orange-400"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {i + 1}. {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((para, j) =>
                    typeof para === "string" ? (
                      <p key={j} className="text-base leading-relaxed text-gray-600 dark:text-slate-400">
                        {para}
                      </p>
                    ) : (
                      <ul key={j} className="space-y-2">
                        {para.list.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 text-base leading-relaxed text-gray-600 dark:text-slate-400"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          {children}

          <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Questions about this policy?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              Contact {SITE.legalName} at{" "}
              <a href={`mailto:${CONTACT.email}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
                {CONTACT.email}
              </a>{" "}
              or{" "}
              <a href={`tel:${CONTACT.phone}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
                {CONTACT.phoneDisplay}
              </a>
              . We are based in {CONTACT.address.city}, {CONTACT.address.country}, and these terms are
              governed by the laws of Nepal.
            </p>
          </div>
        </div>
      </article>
    </PageShell>
  )
}
