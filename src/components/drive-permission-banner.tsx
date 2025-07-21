"use client"

import { useState } from "react"
import { X, ExternalLink } from "lucide-react"
import { Button } from "~/components/ui/button"

interface DrivePermissionBannerProps {
  onClose?: () => void
}

export function DrivePermissionBanner({ onClose }: DrivePermissionBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className="mb-4 border-l-4 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Google Drive 權限設定
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  部分圖片可能因為 Google Drive 權限設定而無法顯示。
                  請確認檔案已設定為「知道連結的任何人都可以檢視」。
                </p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-200 dark:hover:bg-yellow-800/20"
                    onClick={() =>
                      window.open("/GOOGLE_DRIVE_SETUP.md", "_blank")
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    查看設定指南
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-800/20 dark:hover:text-yellow-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
