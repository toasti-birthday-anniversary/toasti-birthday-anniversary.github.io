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
  mediaType?: "image" | "video" // 新增媒體類型屬性
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
  mediaType,
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

  // 檢查 imageUrl 的內容類型
  useEffect(() => {
    if (imageUrl) {
      try {
        const url = new URL(imageUrl)
        if (url.origin !== window.location.origin) {
          console.log("外部 URL:", imageUrl)
          fetch(imageUrl, { method: "HEAD" })
            .then((response) => {
              console.log(
                "外部資源內容類型:",
                response.headers.get("content-type"),
              )
            })
            .catch((error) => {
              console.error("無法檢索外部資源:", error)
            })
        } else {
          console.log("內部 URL:", imageUrl)
        }
      } catch (error) {
        console.error("無效的 URL:", imageUrl, error)
      }
    }
  }, [imageUrl])

  const isVideo =
    mediaType === "video" || // 優先使用 mediaType 判斷
    (typeof imageUrl === "string" &&
      imageUrl.trim().toLowerCase().endsWith(".mp4")) // 更嚴謹的影片判斷

  if (!isOpen) return null

  if (!imageUrl || typeof imageUrl !== "string") {
    console.error("無效的 imageUrl:", imageUrl)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <p className="text-white">媒體資源無效，請檢查 URL。</p>
      </div>
    )
  }

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
            const link = document.createElement("a")
            link.href = imageUrl
            link.download = `media-${Date.now()}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
          title="下載媒體"
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

      {/* 媒體容器 */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={imageUrl}
            controls
            autoPlay
            playsInline
            muted
            loop
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onError={() => console.error("Lightbox 影片載入失敗:", imageUrl)}
          />
        ) : (
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
        )}
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
        <p className="text-sm opacity-75">點擊空白處或按 ESC 關閉</p>
      </div>
    </div>
  )
}
