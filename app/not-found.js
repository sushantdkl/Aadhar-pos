import Link from "next/link"
import { Home, Search, ArrowRight } from "lucide-react"
import PageShell from "@/components/marketing/page-shell"
import { NAV } from "@/lib/content/site"
import { INDUSTRIES } from "@/lib/content/industries"

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <PageShell>
      <section className="flex min-h-[70vh] items-center px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-7xl font-bold text-transparent sm:text-8xl">
            404
          </p>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            We could not find that page.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 dark:text-slate-400">
            The link may be out of date, or the page may have moved. Here are the places people usually
            want.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-7 py-3.5 text-sm font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Tell us what you were looking for
            </Link>
          </div>

          <nav aria-label="Popular pages" className="mt-12 text-left">
            <h2 className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-500">
              Main pages
            </h2>
            <ul className="flex flex-wrap justify-center gap-2">
              {NAV.filter((n) => !n.children).concat([{ label: "Solutions", href: "/solutions" }, { label: "Get a Quote", href: "/get-quote" }]).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mb-3 mt-8 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-500">
              Industry solutions
            </h2>
            <ul className="flex flex-wrap justify-center gap-2">
              {INDUSTRIES.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/solutions/${industry.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-orange-400"
                  >
                    {industry.shortName}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </PageShell>
  )
}
