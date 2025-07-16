import { Home, Search, Bell, MessageCircle, User, Settings } from "lucide-react"

export interface NavigationItem {
  name: string
  icon: typeof Home
  href: string
}

/**
 * Main navigation items used in sidebar and mobile navigation
 */
export const navigationItems: NavigationItem[] = [
  { name: "首頁", icon: Home, href: "/" },
  { name: "探索", icon: Search, href: "/explore" },
  { name: "通知", icon: Bell, href: "/notifications" },
  { name: "訊息", icon: MessageCircle, href: "/messages" },
  { name: "個人檔案", icon: User, href: "/profile" },
  { name: "設定", icon: Settings, href: "/settings" },
]

/**
 * Mobile navigation items (subset of main navigation)
 */
export const mobileNavigationItems: NavigationItem[] = [
  { name: "首頁", icon: Home, href: "/" },
  { name: "探索", icon: Search, href: "/explore" },
  { name: "通知", icon: Bell, href: "/notifications" },
  { name: "訊息", icon: MessageCircle, href: "/messages" },
]
