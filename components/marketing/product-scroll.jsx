"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { SectionHeading } from "./ui"

/**
 * Scroll-driven product pillars.
 *
 * Preserves the original horizontal-scroll treatment on large screens, but
 * falls back to a plain responsive grid on small screens and whenever the
 * visitor prefers reduced motion — a 500vh pinned section is hostile on a phone.
 *
 * Copy describes what the platform actually does; the earlier version claimed
 * PCI-DSS compliance and millisecond transactions, which we cannot substantiate.
 */

const PILLARS = [
  {
    title: "Fast at the counter",
    description:
      "Search, scan, discount and print without leaving the keyboard. Built for a queue, not a demo.",
    video: "/Lightning VFX.webm",
  },
  {
    title: "Stock that stays honest",
    description:
      "Recipes deduct ingredients as you sell. Purchases add them back. Wastage is recorded, not absorbed.",
    video: "/Inventory.webm",
  },
  {
    title: "Cloud hosted and backed up",
    description:
      "Your system runs in the cloud with scheduled backups, reachable from any browser on the premises.",
    video: "/cloud.webm",
  },
  {
    title: "Access control and audit",
    description:
      "Roles decide what staff can see. Edits, voids and discounts are recorded with the user and time.",
    video: "/security.webm",
  },
  {
    title: "One counter or several channels",
    description:
      "Dine-in, takeaway, delivery, QR menu and online order requests all land in the same system.",
    video: "/multichannel.webm",
  },
  {
    title: "Configured to your workflow",
    description:
      "Menus, roles, printers, taxes and reports are set up around how your business actually runs.",
    video: "/Work flow Gear Animation.webm",
  },
]

function PillarCard({ pillar, active, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border p-8 text-center transition-all duration-300 ${
        active
          ? "border-orange-400/60 bg-white shadow-2xl shadow-orange-500/10 dark:bg-slate-800/70"
          : "border-gray-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/40"
      } ${className}`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className="mb-4 h-24 w-24 object-contain motion-reduce:hidden lg:h-28 lg:w-28"
      >
        <source src={pillar.video} type="video/webm" />
      </video>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">{pillar.title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600 dark:text-slate-400 lg:text-base">
        {pillar.description}
      </p>
    </div>
  )
}

export default function ProductScrollSection() {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [enhanced, setEnhanced] = useState(false)
  const reduceMotion = useReducedMotion()

  // The pinned scroll treatment is opt-in: large viewport, pointer input,
  // and motion not reduced.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)")
    const update = () => setEnhanced(mq.matches && !reduceMotion)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [reduceMotion])

  useEffect(() => {
    if (!enhanced) return
    let frame = null

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const el = containerRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        if (scrollable <= 0) return
        setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)))
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enhanced])

  /* ── Static fallback: mobile, tablet, or reduced motion ── */
  if (!enhanced) {
    return (
      <section
        className="bg-gray-50 px-4 py-12 dark:bg-slate-900/50 sm:py-16 lg:py-20"
        aria-labelledby="pillars-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="pillars-heading"
            eyebrow="The Platform"
            title="Built around the parts of the day that actually cost you money."
            subtitle="Billing speed, stock accuracy, access control and reporting — the four places a small business loses money without noticing."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <PillarCard key={p.title} pillar={p} active className="h-full !p-6" />
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/features"
              className="text-sm font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
            >
              See every capability with its status →
            </Link>
          </p>
        </div>
      </section>
    )
  }

  /* ── Enhanced: pinned horizontal scroll ── */
  const titleScale = progress < 0.15 ? 2.6 - (progress / 0.15) * 2.1 : 0.5
  const titleY = progress < 0.15 ? 0 : progress < 0.25 ? -((progress - 0.15) / 0.1) * 340 : -340
  const trackX = progress < 0.25 ? 0 : -((progress - 0.25) / 0.75) * (PILLARS.length - 1) * 500
  const listOpacity = progress < 0.25 ? 0 : Math.min(1, (progress - 0.25) / 0.05)
  const activeIndex = Math.min(
    PILLARS.length - 1,
    Math.max(0, Math.floor(((progress - 0.25) / 0.75) * PILLARS.length))
  )

  return (
    <section
      ref={containerRef}
      className="relative h-[260vh] bg-gray-50 dark:bg-slate-900/50"
      aria-labelledby="pillars-heading"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Headline that shrinks and lifts */}
        <div
          style={{ transform: `scale(${titleScale}) translateY(${titleY}px)` }}
          className="pointer-events-none absolute z-20 text-center transition-transform duration-100 ease-out"
        >
          <h2
            id="pillars-heading"
            className="whitespace-nowrap bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
          >
            AADHAR
          </h2>
          <p className="mt-3 whitespace-nowrap text-xl text-gray-700 dark:text-slate-300 md:text-2xl">
            One platform. Configured per industry.
          </p>
        </div>

        {/* Horizontal track */}
        <div
          style={{ opacity: listOpacity }}
          className="absolute inset-0 flex items-center overflow-hidden pt-28"
          aria-hidden={listOpacity < 0.5}
        >
          <ul
            style={{ transform: `translateX(${trackX}px)` }}
            className="flex gap-8 pl-[50vw] pr-[50vw] transition-transform duration-100 ease-out"
          >
            {PILLARS.map((pillar, i) => (
              <li key={pillar.title} className="w-[440px] shrink-0">
                <PillarCard
                  pillar={pillar}
                  active={i === activeIndex}
                  className={`h-[340px] !p-6 ${i === activeIndex ? "scale-[1.03] opacity-100" : "scale-95 opacity-40"}`}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Progress dots */}
        <div
          style={{ opacity: listOpacity }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2"
          aria-hidden="true"
        >
          {PILLARS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-orange-500" : "w-5 bg-gray-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Always-available text alternative for assistive technology and no-JS */}
      <ul className="sr-only">
        {PILLARS.map((p) => (
          <li key={p.title}>
            <strong>{p.title}</strong> — {p.description}
          </li>
        ))}
      </ul>
    </section>
  )
}
