"use client"

import { useEffect } from "react"

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 * It replaces the whole document, so it must render <html> and <body> and
 * cannot rely on any app styling.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Root layout error:", error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 12px" }}>
            The site could not load.
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px" }}>
            Something failed before the page could render. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "linear-gradient(90deg,#f97316,#f59e0b)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
