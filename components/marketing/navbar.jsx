"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { NAV, PRIMARY_CTA } from "@/lib/content/site"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [openMobileGroup, setOpenMobileGroup] = useState(null)
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const navRef = useRef(null)
  const closeTimer = useRef(null)

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setOpenMobileGroup(null)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Escape closes any open menu; click outside closes the desktop dropdown.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [])

  // Prevent background scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const isActive = useCallback(
    (href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)),
    [pathname]
  )

  const openWithDelay = (label) => {
    clearTimeout(closeTimer.current)
    setOpenDropdown(label)
  }
  const closeWithDelay = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl",
        scrolled
          ? "border-b border-gray-200 dark:border-slate-800 shadow-sm"
          : "border-b border-transparent"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="AADHAR — home"
          >
            <Image
              src="/LOGO_Icon_only.png"
              alt=""
              width={40}
              height={40}
              className="h-8 w-auto sm:h-9"
              priority
            />
            <Image
              src="/LOGO_NAME_ONLY.png"
              alt="AADHAR"
              width={120}
              height={40}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const hasChildren = Array.isArray(item.children)
              const open = openDropdown === item.label
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && openWithDelay(item.label)}
                  onMouseLeave={() => hasChildren && closeWithDelay()}
                >
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-haspopup="true"
                        onClick={() => setOpenDropdown(open ? null : item.label)}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                          isActive(item.href)
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-gray-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
                          aria-hidden="true"
                        />
                      </button>

                      {open && (
                        <div
                          className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-2"
                          onMouseEnter={() => openWithDelay(item.label)}
                          onMouseLeave={closeWithDelay}
                        >
                          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
                            <ul className="p-2">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "block rounded-xl px-3 py-2.5 transition-colors",
                                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                                      isActive(child.href)
                                        ? "bg-orange-500/10"
                                        : "hover:bg-gray-100 dark:hover:bg-slate-800"
                                    )}
                                  >
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                                      {child.label}
                                    </span>
                                    {child.desc && (
                                      <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-slate-400">
                                        {child.desc}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                              <Link
                                href={item.href}
                                className="text-xs font-semibold text-orange-600 hover:underline dark:text-orange-400"
                              >
                                View all {item.label.toLowerCase()} →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                        isActive(item.href)
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Link
              href={PRIMARY_CTA.href}
              className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 motion-safe:hover:-translate-y-0.5"
            >
              {PRIMARY_CTA.label}
            </Link>
          </div>

          {/* Mobile / tablet actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} compact />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-white dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950"
        >
          <ul className="px-4 py-3">
            {NAV.map((item) => {
              const hasChildren = Array.isArray(item.children)
              const groupOpen = openMobileGroup === item.label
              return (
                <li key={item.label} className="border-b border-gray-100 last:border-0 dark:border-slate-800/70">
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenMobileGroup(groupOpen ? null : item.label)}
                        aria-expanded={groupOpen}
                        className="flex w-full items-center justify-between py-3.5 text-left text-base font-semibold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-white"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn("h-4 w-4 text-gray-400 transition-transform", groupOpen && "rotate-180")}
                          aria-hidden="true"
                        />
                      </button>
                      {groupOpen && (
                        <ul className="pb-3 pl-3">
                          <li>
                            <Link
                              href={item.href}
                              className="block py-2 text-sm font-semibold text-orange-600 dark:text-orange-400"
                            >
                              All {item.label}
                            </Link>
                          </li>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block py-2 text-sm text-gray-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "block py-3.5 text-base font-semibold",
                        isActive(item.href)
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-900 dark:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
          <div className="border-t border-gray-200 p-4 dark:border-slate-800">
            <Link
              href={PRIMARY_CTA.href}
              className="block rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-center text-base font-semibold text-white shadow-lg shadow-orange-500/25"
            >
              {PRIMARY_CTA.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function ThemeToggle({ theme, toggleTheme, compact = false }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors",
        "hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
        "dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700",
        compact ? "h-9 w-9" : "h-10 w-10"
      )}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
