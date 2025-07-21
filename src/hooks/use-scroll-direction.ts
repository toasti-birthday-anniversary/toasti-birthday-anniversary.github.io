"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect scroll direction and scroll position
 * @param threshold - Minimum scroll distance to trigger direction change
 * @returns Object containing scroll direction, position, and visibility state
 */
export function useScrollDirection(threshold: number = 10) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up")
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setScrollDirection("down")
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setScrollDirection("up")
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    const handleScroll = () => {
      requestAnimationFrame(updateScrollDirection)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY, threshold])

  return {
    scrollDirection,
    scrollY,
    isVisible,
    isAtTop: scrollY < 50,
  }
}
