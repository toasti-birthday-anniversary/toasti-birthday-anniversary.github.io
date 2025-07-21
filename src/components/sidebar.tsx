"use client"

import { Button } from "~/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { usePathname } from "next/navigation"
import { Cake, Edit3, MoreHorizontal } from "lucide-react"
import { navigationItems } from "~/data/navigation"

/**
 * Main navigation sidebar component
 * Contains navigation menu items and user profile
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 flex h-dvh w-full flex-col overflow-y-auto p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center">
        <Cake className="text-primary mr-2 h-8 w-8" />
        <h1 className="text-2xl font-bold">Toasti</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start text-left transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              asChild
            >
              <a href={item.href} className="flex items-center space-x-3">
                <item.icon className="h-6 w-6" />
                <span className="hidden font-medium lg:block">{item.name}</span>
              </a>
            </Button>
          )
        })}
      </nav>

      {/* Tweet Button */}
      <div className="mb-4">
        <Button className="w-full" size="lg">
          <Edit3 className="mr-2 h-5 w-5 lg:mr-0 lg:hidden" />
          <span className="hidden lg:block">發布貼文</span>
        </Button>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src="/toasti_owo_.png" alt="吐司是一片浣熊的頭像" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <div className="hidden flex-1 lg:block">
          <p className="text-sm font-medium">吐司是一片浣熊</p>
          <p className="text-muted-foreground text-xs">@toasti_owo_</p>
        </div>
        <Button variant="ghost" size="sm" className="hidden lg:flex">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
