"use client"

import { useEffect, useRef } from  "react"
import Lenis from "lenis"
import { usePathname } from  "next/navigation"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  const isDashboard = pathname?.startsWith("/dashboard")

  useEffect(() => {
    if (isDashboard) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      if (typeof document !== "undefined") {
        document.documentElement.style.removeProperty("overflow")
        document.body.style.removeProperty("overflow")
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped")
      }
      return
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [isDashboard])

  // Reset scroll on route change
  useEffect(() => {
    if (!isDashboard && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }, [pathname, isDashboard])

  return <>{children}</>
}
