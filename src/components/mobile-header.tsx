"use client"

import { useScrollDirection } from "~/hooks/use-scroll-direction"
import { usePathname } from "next/navigation"

/**
 * Mobile header that appears when scrolling up, similar to Twitter
 */
export function MobileHeader() {
  const { scrollDirection, isAtTop } = useScrollDirection()
  const pathname = usePathname()

  // Get page title based on current route
  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "首頁"
      case "/":
        return "探索"
      case "/":
        return "通知"
      case "/":
        return "訊息"
      case "/":
        return "個人檔案"
      case "/":
        return "設定"
      default:
        return "Toasti"
    }
  }

  // Show header when scrolling up and not at the top
  const shouldShow = scrollDirection === "up" && !isAtTop

  // Background opacity - more transparent when not at top, but with strong blur for readability
  const getBackgroundClass = () => {
    return "bg-background/85" // 85% opacity for subtle transparency with good readability
  }

  return (
    <div
      className={`border-border fixed inset-x-0 top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300 md:hidden ${getBackgroundClass()} ${
        shouldShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex h-12 items-center justify-center px-4">
        <h1 className="text-base font-bold">{getPageTitle()}</h1>
      </div>
    </div>
  )
}
