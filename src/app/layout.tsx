import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "~/components/theme-provider"
import { Sidebar } from "~/components/sidebar"
import { RightPanel } from "~/components/right-panel"
import { MobileNavigation } from "~/components/mobile-navigation"
import { MobileHeader } from "~/components/mobile-header"
import { FloatingActionButton } from "~/components/floating-action-button"

export const metadata: Metadata = {
  title: "Toasti - 生日週年慶祝平台",
  description: "記錄和慶祝重要的生日與週年紀念日",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className="bg-background min-h-dvh overflow-x-hidden font-sans antialiased">
          <div className="mx-auto w-full max-w-none md:max-w-7xl">
            <div className="flex min-h-dvh w-full pb-14 md:pb-0">
              {/* Left Sidebar */}
              <div className="hidden md:flex md:w-64 lg:w-80">
                <Sidebar />
              </div>

              {/* Main Content */}
              <main className="border-border min-w-0 flex-1 md:border-x">
                {children}
              </main>

              {/* Right Panel */}
              <div className="hidden lg:flex lg:w-80">
                <RightPanel />
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <MobileHeader />

          {/* Mobile Navigation */}
          <MobileNavigation />

          {/* Mobile FAB */}
          <FloatingActionButton />
        </body>
      </ThemeProvider>
    </html>
  )
}
