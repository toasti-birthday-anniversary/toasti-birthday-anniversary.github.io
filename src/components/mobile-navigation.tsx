"use client"

import { Button } from "~/components/ui/button"
import { usePathname } from "next/navigation"
import { useScrollDirection } from "~/hooks/use-scroll-direction"
import { mobileNavigationItems } from "~/data/navigation"

/**
 * Mobile bottom navigation component with scroll-based transparency
 */
export function MobileNavigation() {
  const pathname = usePathname()
  const { scrollDirection, isAtTop } = useScrollDirection()

  // Determine background opacity based on scroll direction and position
  const getBackgroundClass = () => {
    if (isAtTop) {
      return "bg-background/90" // Slightly more transparent even at top
    }
    return scrollDirection === "down" ? "bg-background/75" : "bg-background/85"
  }

  return (
    <div
      className={`border-border fixed inset-x-0 bottom-0 z-50 w-full border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-all duration-300 md:hidden ${getBackgroundClass()}`}
    >
      <div className="flex h-14 w-full items-center">
        {mobileNavigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={`flex h-full flex-1 flex-col items-center justify-center space-y-0.5 rounded-none transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              asChild
            >
              <a
                href={item.href}
                className="flex flex-col items-center justify-center space-y-1"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-[9px] font-medium">{item.name}</span>
              </a>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
