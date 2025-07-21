/**
 * Google Drive 媒體處理工具函數
 */

/**
 * 處理 Google Drive 頭像 URL
 * 將不同格式的 Google Drive 連結轉換為可直接顯示的格式
 */
export function processAvatarUrl(url: string | undefined): string | undefined {
  if (!url || !url.includes("drive.google.com")) {
    return url
  }

  try {
    let fileId: string | undefined

    // 格式1: https://drive.google.com/file/d/FILE_ID/view
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//)
    if (viewMatch) {
      fileId = viewMatch[1]
    }

    // 格式2: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openMatch) {
      fileId = openMatch[1]
    }

    // 格式3: 已經是 uc 格式
    const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/)
    if (ucMatch) {
      fileId = ucMatch[1]
    }

    if (fileId) {
      // 嘗試使用 Google Drive 的 thumbnail API 作為 CDN
      // 這個格式更可靠，不需要特殊權限設定
      const processedUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`
      return processedUrl
    }
  } catch (error) {
    console.error("頭像 URL 處理錯誤:", error)
  }

  return url
}

/**
 * 處理 Google Drive 媒體 URL（圖片/影片）
 * 支援檔案上傳和一般分享連結
 */
export function processMediaUrl(url: string | null): {
  url: string | null
  type: "image" | "video" | "unknown"
} {
  if (!url || !url.includes("drive.google.com")) {
    return { url: null, type: "unknown" }
  }

  try {
    // 處理不同格式的 Google Drive 連結
    let fileId: string | undefined

    // 格式1: https://drive.google.com/file/d/FILE_ID/view
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//)
    if (viewMatch) {
      fileId = viewMatch[1]
    }

    // 格式2: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openMatch) {
      fileId = openMatch[1]
    }

    // 格式3: 已經是 uc 格式
    const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/)
    if (ucMatch) {
      fileId = ucMatch[1]
    }

    if (fileId) {
      // 使用 Google Drive thumbnail API 作為 CDN
      const directUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`

      // 如果原 URL 包含檔案資訊，嘗試推斷類型
      const isVideo =
        url.includes("video") || url.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)
      const isImage =
        url.includes("image") ||
        url.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i)

      const type: "image" | "video" | "unknown" = isVideo
        ? "video"
        : isImage
          ? "image"
          : "image" // 預設為圖片

      return { url: directUrl, type }
    }
  } catch (error) {
    console.error("媒體 URL 處理錯誤:", error)
  }

  return { url: null, type: "unknown" }
}
