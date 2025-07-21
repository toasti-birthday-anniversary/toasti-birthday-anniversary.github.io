"use client"

import { Button } from "~/components/ui/button"
import { Edit3 } from "lucide-react"

/**
 * Floating Action Button for mobile tweet composition
 */
export function FloatingActionButton() {
  const handleClick = () => {
    // TODO: Open tweet composer modal
    console.log("Open tweet composer")
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="bg-primary hover:bg-primary/90 fixed right-4 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 h-10 w-10 rounded-full shadow-lg md:hidden"
    >
      <Edit3 className="h-4 w-4" />
    </Button>
  )
}
