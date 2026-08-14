import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Navbar from "./navbar"
import Footer from "./footer"

/**
 * Standard chrome for every marketing page: fixed navbar, a `<main>` landmark
 * that the skip link targets, and the footer.
 */
export default function PageShell({ children, className = "" }) {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className={`min-h-screen bg-white transition-colors duration-300 dark:bg-slate-950 ${className}`}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-slate-500">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-gray-300 dark:text-slate-700" aria-hidden="true" />}
              {last ? (
                <span aria-current="page" className="font-medium text-gray-700 dark:text-slate-300">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-orange-600 dark:hover:text-orange-400">
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Consistent page header used across the inner marketing pages. */
export function PageHero({ eyebrow, title, subtitle, children, breadcrumbs }) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-orange-50/70 via-white to-white px-4 pb-14 pt-28 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,146,60,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,.5) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && (
          <span className="mb-5 inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400 sm:text-sm">
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-slate-400 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
