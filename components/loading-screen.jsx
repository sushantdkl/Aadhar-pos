"use client"

import { useState, useEffect } from "react"

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("filling") // filling -> filled -> exiting -> done
  const [fillPercent, setFillPercent] = useState(0)

  useEffect(() => {
    // Animate fill from 0 to 100 over ~1.8s
    const startTime = Date.now()
    const duration = 1800

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setFillPercent(eased * 100)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setPhase("filled")
        // Brief pause at full, then exit
        setTimeout(() => {
          setPhase("exiting")
          setTimeout(() => {
            setPhase("done")
            onComplete?.()
          }, 600)
        }, 300)
      }
    }

    requestAnimationFrame(animate)
  }, [onComplete])

  if (phase === "done") return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-all duration-600 ${
        phase === "exiting" ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{ transitionDuration: "600ms" }}
    >
      {/* Logo container */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36">
        {/* Gray/dim base logo (unfilled state) */}
        <img
          src="/LOGO_Icon_only.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            filter: "grayscale(100%) opacity(0.15)",
          }}
          draggable={false}
        />

        {/* Colored logo revealed from bottom to top */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            clipPath: `inset(${100 - fillPercent}% 0 0 0)`,
          }}
        >
          <img
            src="/LOGO_Icon_only.png"
            alt="Aadhar"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Shine sweep effect during fill */}
        {phase === "filling" && fillPercent > 10 && fillPercent < 95 && (
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              clipPath: `inset(${100 - fillPercent}% 0 0 0)`,
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: "shimmer 1.2s ease-in-out infinite",
                transform: "skewX(-20deg)",
              }}
            />
          </div>
        )}
      </div>

      {/* Brand name that fades in after fill */}
      <div
        className={`mt-6 transition-all duration-500 ${
          fillPercent > 60 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <img
          src="/LOGO_NAME_ONLY.png"
          alt="Aadhar"
          className="h-8 sm:h-10 w-auto"
          draggable={false}
        />
      </div>

      {/* Minimal loading bar */}
      <div className="mt-8 w-32 sm:w-40 h-0.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-none"
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
      `}</style>
    </div>
  )
}
