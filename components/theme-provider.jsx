"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

const STORAGE_KEY = "aadhar-theme"

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }) {
  // The inline script in the root layout has already applied the correct class
  // to <html> before paint, so we read from the DOM rather than guessing and
  // re-rendering. That avoids both a flash and a wrapper element.
  const [theme, setThemeState] = useState("dark")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setThemeState(isDark ? "dark" : "light")
  }, [])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    const root = document.documentElement
    root.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode, blocked cookies).
      // The theme still applies for this session.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
  }, [setTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
  )
}
