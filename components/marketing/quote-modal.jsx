"use client"

import { useEffect, useRef, useCallback } from "react"
import { X } from "lucide-react"
import QuoteForm from "./quote-form"

/**
 * Reusable quotation modal.
 *
 * Handles the accessibility work a dialog needs: focus is moved in on open,
 * trapped while open, restored on close; Escape and backdrop clicks dismiss;
 * background scroll is locked.
 */
export default function QuoteModal({ open, onClose, defaultPackage = "", defaultBusinessType = "", title = "Request a quotation" }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== "Tab") return

      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    // Move focus into the dialog on open.
    const timer = setTimeout(() => {
      const target = dialogRef.current?.querySelector("input, select, textarea, button")
      target?.focus()
    }, 50)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = overflow
      previouslyFocused.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        onKeyDown={handleKeyDown}
        className="my-8 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-2xl border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
          <h2 id="quote-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quotation form"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <QuoteForm defaultPackage={defaultPackage} defaultBusinessType={defaultBusinessType} />
        </div>
      </div>
    </div>
  )
}
