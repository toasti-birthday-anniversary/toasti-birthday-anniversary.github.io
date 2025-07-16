"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Download, ExternalLink } from "lucide-react"
import { Button } from "~/components/ui/button"

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt?: string
}

/**
 * 圖片放大顯示 Lightbox 組件
 * 支援鍵盤操作、下載、外部連結等功能
 */
export function ImageLightbox({
  isOpen,
  onClose,
  imageUrl,
  alt = "圖片",
}: ImageLightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // 處理 ESC 鍵關閉
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      // 防止背景滾動
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // 重置圖片載入狀態
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false)
    }
  }, [isOpen, imageUrl])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 控制按鈕 */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            window.open(imageUrl, "_blank")
          }}
          title="在新分頁開啟"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            // 創建一個隱藏的 a 標籤來觸發下載
            const link = document.createElement("a")
            link.href = imageUrl
            link.download = `image-${Date.now()}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
          title="下載圖片"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={onClose}
          title="關閉 (ESC)"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 圖片容器 */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 載入指示器 */}
        {!imageLoaded && (
          <div className="bg-muted flex h-96 w-96 items-center justify-center rounded-lg">
            <div className="text-muted-foreground">載入中...</div>
          </div>
        )}

        {/* 主要圖片 */}
        <Image
          src={imageUrl}
          alt={alt}
          width={1200}
          height={800}
          className={`max-h-[90vh] max-w-[90vw] object-contain transition-opacity ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error("Lightbox 圖片載入失敗:", imageUrl)
            setImageLoaded(true) // 即使失敗也要顯示
          }}
          priority
        />
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
        <p className="text-sm opacity-75">點擊空白處或按 ESC 關閉</p>
      </div>
    </div>
  )
}
