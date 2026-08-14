"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { CONTACT } from "@/lib/content/site"

/**
 * Route-level error boundary. Catches render and data errors in any page so a
 * failure shows a usable page with a way forward rather than a blank screen.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Logged for diagnostics; the message itself is never shown to the visitor.
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Something went wrong on this page.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 dark:text-slate-400">
          This is our fault, not yours. Try loading the page again — if it keeps happening, tell us and we
          will fix it.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-7 py-3.5 text-sm font-bold text-gray-800 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-slate-600 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-400"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-slate-500">
          Need help now? Call{" "}
          <a href={`tel:${CONTACT.phone}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
            {CONTACT.phoneDisplay}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${CONTACT.email}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    </div>
  )
}
