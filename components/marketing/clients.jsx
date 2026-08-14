"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Building2, ExternalLink } from "lucide-react"
import { CLIENTS, CLIENT_CATEGORIES, CLIENT_STATUS_META, CLIENTS_FOOTNOTE } from "@/lib/content/clients"
import { SectionHeading, Card, DisclosureNote } from "./ui"
import { cn } from "@/lib/utils"

const statusTone = {
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
}

/** Deterministic monogram — used when a client has no logo asset on file. */
function monogram(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function ClientCard({ client, index }) {
  const reduceMotion = useReducedMotion()
  const status = CLIENT_STATUS_META[client.status]

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="h-full"
    >
      <Card interactive className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          {client.logo ? (
            // Client logos carry their own baked-in backgrounds (white, grey,
            // green, red), so they sit on a neutral white tile that reads
            // correctly in both themes rather than fighting the page surface.
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-gray-200 dark:ring-slate-700">
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </span>
          ) : (
            // Text-based client card — never a stock photograph standing in for a real logo.
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-amber-500/5 text-lg font-bold text-orange-600 ring-1 ring-orange-500/20 dark:text-orange-400"
            >
              {monogram(client.name)}
            </span>
          )}

          {status && (
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                statusTone[status.tone]
              )}
            >
              {status.label}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-gray-900 dark:text-white">{client.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
          {client.categoryLabel}
        </p>

        <p className="mt-3 text-sm font-medium text-gray-800 dark:text-slate-200">{client.solution}</p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{client.summary}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4 dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-500">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            {client.location}
          </span>

          <div className="flex items-center gap-3">
            {/* Rendered only when real case-study content exists. */}
            {client.caseStudyHref && (
              <Link
                href={client.caseStudyHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline dark:text-orange-400"
              >
                Read case study
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            )}
            {/* The client's live site — verifiable proof, not a claim. */}
            {client.website && (
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded text-xs font-semibold text-orange-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-orange-400"
              >
                Visit site
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.article>
  )
}

export default function Clients({
  eyebrow = "Solutions Delivered",
  title = "Solutions delivered for real businesses.",
  subtitle = "Every business below runs a system AADHAR built and delivered — and where we built their website too, you can open it and judge the work yourself. We publish names only with permission, and we do not publish invented testimonials, ratings or performance figures.",
  showFilters = true,
  limit,
  className = "",
}) {
  const [filter, setFilter] = useState("all")

  const visible = useMemo(() => {
    const list = filter === "all" ? CLIENTS : CLIENTS.filter((c) => c.category === filter)
    return limit ? list.slice(0, limit) : list
  }, [filter, limit])

  // Only offer filters that actually match a client.
  const availableCategories = useMemo(
    () => CLIENT_CATEGORIES.filter((c) => c.id === "all" || CLIENTS.some((cl) => cl.category === c.id)),
    []
  )

  return (
    <section
      className={cn("bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-900/50 sm:py-16 lg:py-20", className)}
      aria-labelledby="clients-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="clients-heading" eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {showFilters && (
          <div role="group" aria-label="Filter clients by industry" className="mt-10 flex flex-wrap justify-center gap-2">
            {availableCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={filter === c.id}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
                  filter === c.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((client, i) => (
            <ClientCard key={client.id} client={client} index={i} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-gray-500 dark:text-slate-500">
            No published clients in this category yet.
          </p>
        )}

        <DisclosureNote className="mx-auto mt-10 max-w-2xl text-center">{CLIENTS_FOOTNOTE}</DisclosureNote>
      </div>
    </section>
  )
}
