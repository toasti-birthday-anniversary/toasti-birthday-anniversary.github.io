"use client"

import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useScrollDirection } from "~/hooks/use-scroll-direction"
import { useRouter } from "next/navigation"

/**
 * Page header component with title and navigation options
 */
interface PageHeaderProps {
  title: string
  showBack?: boolean
}

export function PageHeader({ title, showBack = false }: PageHeaderProps) {
  const { scrollDirection, isAtTop } = useScrollDirection()
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  // Determine background opacity based on scroll direction
  const getBackgroundClass = () => {
    if (isAtTop) {
      return "bg-background/80"
    }
    return scrollDirection === "down" ? "bg-background/60" : "bg-background/90"
  }

  return (
    <div
      className={`border-border sticky top-0 z-10 border-b backdrop-blur-sm transition-all duration-300 ${getBackgroundClass()}`}
    >
      <div className="flex h-14 items-center px-4">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-base font-bold sm:text-xl">{title}</h1>
      </div>
    </div>
  )
}
