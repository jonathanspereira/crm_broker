"use client"

import * as React from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    try {
      const theme = localStorage.getItem("theme")
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      }
    } catch (e) {}
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
