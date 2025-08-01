/**
 * 媒體處理工具函數 (純前端版本)
 */

export interface MediaFile {
  url: string
  type: "image" | "video" | "unknown"
}

/**
 * 處理媒體 URL（向後相容 Google Drive，但主要用於本地檔案）
 */
export function processMediaUrl(url: string | null): {
  url: string | null
  type: "image" | "video" | "unknown"
} {
  if (!url) return { url: null, type: "unknown" }

  return {
    url,
    type: getMediaType(url),
  }
}

/**
 * 將字串陣列轉換為 MediaFile 陣列
 */
export function stringArrayToMediaFiles(
  files: string[] | undefined | null,
): MediaFile[] {
  if (!files || !Array.isArray(files)) {
    console.log("stringArrayToMediaFiles: files is not an array:", files)
    return []
  }

  console.log("stringArrayToMediaFiles: processing files:", files)

  return files.map((url) => ({
    url,
    type: getMediaType(url),
  }))
}

/**
 * 根據檔案副檔名判斷媒體類型
 */
export function getMediaType(url: string): "image" | "video" | "unknown" {
  const extension = url.toLowerCase().split(".").pop()

  if (!extension) return "unknown"

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return "image"
  }

  if (["mp4", "webm", "mov", "avi"].includes(extension)) {
    return "video"
  }

  return "unknown"
}

/**
 * 檢查媒體檔案是否存在 (純前端版本 - 直接嘗試載入)
 * 注意：這個函數在純前端環境下無法真正檢查檔案存在性
 * 建議在建構時期就處理好媒體檔案列表
 */
export async function checkMediaFileExists(
  postId: string,
  filename: string,
): Promise<boolean> {
  try {
    const response = await fetch(`/img/${postId}/${filename}`, {
      method: "HEAD",
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * 檢查頭像是否存在 (純前端版本)
 */
export async function checkAvatarExists(postId: string): Promise<boolean> {
  return checkMediaFileExists(postId, "avatar.png")
}

/**
 * 取得所有媒體檔案 (純前端版本 - 預定義列表)
 * 這個函數現在返回預先知道的媒體檔案
 * 實際使用時應該從 tweets.json 中取得 media 陣列
 */
export function getMediaFiles(postId: string): string[] {
  // 對於純前端版本，我們直接返回空陣列
  // 實際的媒體檔案應該已經在 tweets.json 中定義好了
  console.warn(
    `getMediaFiles(${postId}): 在純前端環境下，媒體檔案應該預先在 tweets.json 中定義`,
  )
  return []
}

/**
 * Split media files into chunks of maximum 4 files each
 */
export function splitMediaIntoChunks(
  mediaFiles: string[],
  maxPerChunk = 4,
): string[][] {
  const chunks: string[][] = []

  for (let i = 0; i < mediaFiles.length; i += maxPerChunk) {
    chunks.push(mediaFiles.slice(i, i + maxPerChunk))
  }

  return chunks
}

/**
 * Generate replies data for additional media chunks
 */
export function generateMediaReplies(
  postId: string,
  author: { name: string; username: string },
  mediaChunks: string[][],
  baseTimestamp: string,
): Array<{
  id: string
  author: { name: string; username: string }
  content: string
  timestamp: string
  likes: number
  media: string[]
}> {
  if (mediaChunks.length <= 1) {
    return []
  }

  const replies = []

  // Start from the second chunk (first chunk goes in main tweet)
  for (let i = 1; i < mediaChunks.length; i++) {
    replies.push({
      id: `${postId}-reply-${i}`,
      author: {
        name: author.name,
        username: author.username,
      },
      content: "", // Empty content for media-only replies
      timestamp: baseTimestamp,
      likes: Math.floor(Math.random() * 10), // Random likes for now
      media: mediaChunks[i],
    })
  }

  return replies
}
