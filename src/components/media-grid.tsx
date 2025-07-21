"use client"

import Image from "next/image"
import { useState } from "react"
import { ImageLightbox } from "~/components/image-lightbox"

interface MediaFile {
  url: string
  type: "image" | "video" | "unknown"
}

interface MediaGridProps {
  files: MediaFile[]
  onMediaClick?: (url: string) => void
}

/**
 * Twitter 風格的媒體網格組件
 * 支援 1-4 個媒體檔案的不同布局，並支援圖片放大顯示
 */
export function MediaGrid({ files, onMediaClick }: MediaGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url))
  }

  const handleMediaClick = (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    // 如果是圖片，打開 lightbox
    if (files.find((f) => f.url === url)?.type === "image") {
      setLightboxImage(url)
    } else if (onMediaClick) {
      onMediaClick(url)
    } else {
      window.open(url, "_blank")
    }
  }

  if (files.length === 0) return null

  // 單個媒體檔案
  if (files.length === 1) {
    const file = files[0]
    return (
      <>
        <div className="mt-3 overflow-hidden rounded-lg border">
          <MediaItem
            file={file}
            className="max-h-96 w-full"
            onMediaClick={handleMediaClick}
            onImageError={handleImageError}
            hasError={imageErrors.has(file.url)}
          />
        </div>

        {/* Lightbox */}
        <ImageLightbox
          isOpen={lightboxImage !== null}
          onClose={() => setLightboxImage(null)}
          imageUrl={lightboxImage || ""}
          alt="媒體檔案"
        />
      </>
    )
  }

  // 兩個媒體檔案 - 並排
  if (files.length === 2) {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-lg border">
          {files.map((file, index) => (
            <MediaItem
              key={index}
              file={file}
              className="aspect-square"
              onMediaClick={handleMediaClick}
              onImageError={handleImageError}
              hasError={imageErrors.has(file.url)}
            />
          ))}
        </div>

        {/* Lightbox */}
        <ImageLightbox
          isOpen={lightboxImage !== null}
          onClose={() => setLightboxImage(null)}
          imageUrl={lightboxImage || ""}
          alt="媒體檔案"
        />
      </>
    )
  }

  // 三個媒體檔案 - 一個大的 + 兩個小的
  if (files.length === 3) {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-lg border">
          <MediaItem
            file={files[0]}
            className="row-span-2"
            onMediaClick={handleMediaClick}
            onImageError={handleImageError}
            hasError={imageErrors.has(files[0].url)}
          />
          <div className="grid grid-rows-2 gap-1">
            {files.slice(1).map((file, index) => (
              <MediaItem
                key={index + 1}
                file={file}
                className="aspect-square"
                onMediaClick={handleMediaClick}
                onImageError={handleImageError}
                hasError={imageErrors.has(file.url)}
              />
            ))}
          </div>
        </div>

        {/* Lightbox */}
        <ImageLightbox
          isOpen={lightboxImage !== null}
          onClose={() => setLightboxImage(null)}
          imageUrl={lightboxImage || ""}
          alt="媒體檔案"
        />
      </>
    )
  }

  // 四個或更多媒體檔案 - 2x2 網格，第四個顯示 +N 更多
  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-lg border">
        {files.slice(0, 3).map((file, index) => (
          <MediaItem
            key={index}
            file={file}
            className="aspect-square"
            onMediaClick={handleMediaClick}
            onImageError={handleImageError}
            hasError={imageErrors.has(file.url)}
          />
        ))}
        <div className="relative aspect-square">
          <MediaItem
            file={files[3]}
            className="aspect-square"
            onMediaClick={handleMediaClick}
            onImageError={handleImageError}
            hasError={imageErrors.has(files[3].url)}
          />
          {files.length > 4 && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-white hover:bg-black/60"
              onClick={(e) => handleMediaClick(files[3].url, e)}
            >
              <span className="text-lg font-bold">+{files.length - 4}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxImage !== null}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage || ""}
        alt="媒體檔案"
      />
    </>
  )
}

interface MediaItemProps {
  file: MediaFile
  className?: string
  onMediaClick: (url: string, event?: React.MouseEvent) => void
  onImageError: (url: string) => void
  hasError: boolean
}

function MediaItem({
  file,
  className = "",
  onMediaClick,
  onImageError,
  hasError,
}: MediaItemProps) {
  if (hasError || file.type === "unknown") {
    const isDriveFile = file.url.includes("drive.google.com")

    return (
      <div
        className={`text-muted-foreground bg-muted flex cursor-pointer items-center justify-center ${className}`}
        onClick={(e) => {
          e.stopPropagation()
          if (isDriveFile) {
            // 直接在新分頁開啟原始 Google Drive 連結
            const originalUrl = file.url.includes("thumbnail")
              ? file.url.replace(
                  /\/thumbnail\?id=([^&]+)&.*/,
                  "/file/d/$1/view",
                )
              : file.url
            window.open(originalUrl, "_blank")
          } else {
            onMediaClick(file.url, e)
          }
        }}
        title={isDriveFile ? "點擊在新分頁開啟 Google Drive 圖片" : "媒體檔案"}
      >
        <span className="text-center text-sm">
          {isDriveFile ? (
            <>
              �️
              <br />
              點擊查看
            </>
          ) : (
            <>
              📎
              <br />
              附件
            </>
          )}
        </span>
      </div>
    )
  }

  if (file.type === "video") {
    return (
      <video
        src={file.url}
        className={`object-cover ${className}`}
        controls
        onClick={(e) => e.stopPropagation()}
      >
        您的瀏覽器不支援影片播放
      </video>
    )
  }

  // 圖片
  return (
    <Image
      src={file.url}
      alt="媒體檔案"
      width={300}
      height={300}
      className={`cursor-pointer object-cover transition-opacity hover:opacity-90 ${className}`}
      onClick={(e) => onMediaClick(file.url, e)}
      onError={() => onImageError(file.url)}
    />
  )
}
