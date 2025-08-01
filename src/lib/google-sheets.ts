/**
 * Google Sheets API 資料處理工具
 * 用於從 Google Sheets 動態讀取生日祝福資料
 */

/**
 * Google Sheets 配置
 */
export const GOOGLE_SHEETS_CONFIG = {
  // 您的 Google Sheets ID（從 URL 中提取）
  SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "",
  // API Key（需要在 Google Cloud Console 建立）
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  // 工作表範圍
  RANGE: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RANGE || "Sheet1!A:E",
}

/**
 * 從 Google Sheets API 回應中解析推文資料
 */
export interface GoogleSheetsRow {
  timestamp: string
  name: string
  avatar: string | null
  message: string
  gift: string | null
  media?: string | null // 新增：媒體檔案（圖片/影片）
}

/**
 * 解析日期字串為相對時間
 */
function parseTimestamp(timestamp: string): string {
  if (!timestamp) return "未知時間"

  try {
    // 如果是 Google Sheets 的日期格式
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return ""

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffDays > 30) {
      return `${date.getMonth() + 1}月${date.getDate()}日`
    } else if (diffDays > 0) {
      return `${diffDays}天前`
    } else if (diffHours > 0) {
      return `${diffHours}小時前`
    } else {
      return "剛剛"
    }
  } catch (error) {
    console.error("日期解析錯誤:", error)
    return ""
  }
}
/**
 * 處理 Google Drive 頭像 URL（向後相容）
 */
function processAvatarUrl(url: string | null): string | null {
  const result = processMediaUrl(url)
  return result.url
}

/**
 * 生成 username
 */
function generateUsername(name: string): string {
  if (!name) return "anonymous"

  return name
    .replace(/\s+/g, "")
    .replace(/[^\w\u4e00-\u9fff]/g, "")
    .toLowerCase()
    .substring(0, 15)
}

/**
 * 從 Google Sheets 獲取資料
 */
export async function fetchGoogleSheetsData(): Promise<Tweet[]> {
  const { SHEET_ID, API_KEY, RANGE } = GOOGLE_SHEETS_CONFIG

  // 檢查是否為測試/佔位符配置
  const isPlaceholderConfig =
    !SHEET_ID ||
    !API_KEY ||
    SHEET_ID === "your_google_sheet_id_here" ||
    API_KEY === "your_google_api_key_here" ||
    SHEET_ID.includes("example") ||
    API_KEY.includes("example")

  if (isPlaceholderConfig) {
    console.warn("Google Sheets 配置未完成或為測試配置，使用本地資料")
    // 回傳本地備份資料
    const { getTweets } = await import("../data/tweets")
    return getTweets()
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Sheets API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return parseGoogleSheetsResponse(data)
  } catch (error) {
    console.error("讀取 Google Sheets 資料失敗:", error)
    // 發生錯誤時使用本地備份資料
    const { getTweets } = await import("../data/tweets")
    return getTweets()
  }
}

/**
 * Check if this user should have replies
 * Uses same logic as the tweet detail page
 */
function shouldHaveReplies(
  author: { name: string; username: string },
  tweetId: string,
): number {
  // Check by tweet ID first (if provided and matches)
  if (tweetId === "32") {
    return 6
  }

  // Check by various identifiers that are less likely to change
  const targetIdentifiers = [
    "罐頭", // Name contains
  ]

  const authorNameLower = author.name.toLowerCase()
  const authorUsernameLower = author.username.toLowerCase()

  const hasTargetIdentifier = targetIdentifiers.some(
    (identifier) =>
      authorNameLower.includes(identifier.toLowerCase()) ||
      authorUsernameLower.includes(identifier.toLowerCase()),
  )

  return hasTargetIdentifier ? 6 : 0
}

/**
 * Check if this user should have gift text in content
 */
function shouldHaveGiftText(
  author: { name: string; username: string },
  tweetId: string,
): boolean {
  // Check by tweet ID first (if provided and matches)
  if (tweetId === "32") {
    return true
  }

  // Check by various identifiers that are less likely to change
  const targetIdentifiers = [
    "罐頭", // Name contains
  ]

  const authorNameLower = author.name.toLowerCase()
  const authorUsernameLower = author.username.toLowerCase()

  return targetIdentifiers.some(
    (identifier) =>
      authorNameLower.includes(identifier.toLowerCase()) ||
      authorUsernameLower.includes(identifier.toLowerCase()),
  )
}

/**
 * 解析 Google Sheets API 回應（用於詳情頁面，不包含禮物文字）
 */
function parseGoogleSheetsResponseForDetail(data: {
  values?: string[][]
}): Tweet[] {
  if (!data.values || data.values.length < 2) {
    console.warn("Google Sheets 資料為空或格式錯誤")
    return []
  }

  const tweets: Tweet[] = []
  const rows = data.values.slice(1) // 跳過標題行

  rows.forEach((row: string[], index: number) => {
    // 根據實際 msg.json 結構：A=時間戳記, B=名字, C=頭貼, D=訊息, E=禮物檔案
    const [timestamp, name, avatar, message] = row

    // 跳過空的訊息
    if (!message) return

    // 詳情頁面不添加禮物文字
    const content = message

    // 不處理 Google Sheets 的媒體檔案，讓 organize-media.js 來處理本地檔案

    const tweet: Tweet = {
      id: String(index + 1),
      author: {
        name: name || "匿名朋友",
        username: generateUsername(name),
        avatar: processAvatarUrl(avatar) || undefined,
      },
      content,
      timestamp: parseTimestamp(timestamp),
      likes: Math.floor(Math.random() * 50) + 1,
      retweets: Math.floor(Math.random() * 10),
      replies: shouldHaveReplies(
        {
          name: name || "匿名朋友",
          username: generateUsername(name),
        },
        String(index + 1),
      ),
      isLiked: Math.random() > 0.7,
      isRetweeted: Math.random() > 0.9,
      media: undefined, // 不使用 Google Sheets 的媒體，讓 organize-media.js 來處理本地檔案
    }

    tweets.push(tweet)
  })

  // 按時間排序（最新的在前面）
  return tweets.reverse()
}

/**
 * 解析 Google Sheets API 回應
 */
function parseGoogleSheetsResponse(data: { values?: string[][] }): Tweet[] {
  if (!data.values || data.values.length < 2) {
    console.warn("Google Sheets 資料為空或格式錯誤")
    return []
  }

  const tweets: Tweet[] = []
  const rows = data.values.slice(1) // 跳過標題行

  rows.forEach((row: string[], index: number) => {
    // 根據實際 msg.json 結構：A=時間戳記, B=名字, C=頭貼, D=訊息, E=禮物檔案
    const [timestamp, name, avatar, message] = row

    // 跳過空的訊息
    if (!message) return

    let content = message

    // 為特定使用者（罐頭）添加禮物文字
    const author = {
      name: name || "匿名朋友",
      username: generateUsername(name),
    }

    if (shouldHaveGiftText(author, String(index + 1))) {
      content += "\n\n🎁 附贈禮物在留言區"
    }

    // 不處理 Google Sheets 的媒體檔案，讓 organize-media.js 來處理本地檔案

    const tweet: Tweet = {
      id: String(index + 1),
      author: {
        name: name || "匿名朋友",
        username: generateUsername(name),
        avatar: processAvatarUrl(avatar) || undefined,
      },
      content,
      timestamp: parseTimestamp(timestamp),
      likes: Math.floor(Math.random() * 50) + 1,
      retweets: Math.floor(Math.random() * 10),
      replies: shouldHaveReplies(
        {
          name: name || "匿名朋友",
          username: generateUsername(name),
        },
        String(index + 1),
      ),
      isLiked: Math.random() > 0.7,
      isRetweeted: Math.random() > 0.9,
      media: undefined, // 不使用 Google Sheets 的媒體，讓 organize-media.js 來處理本地檔案
    }

    tweets.push(tweet)
  })

  // 按時間排序（最新的在前面）
  return tweets.reverse()
}

/**
 * 帶快取的資料讀取
 */
let cachedTweets: Tweet[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 分鐘快取

export async function getTweetsWithCache(): Promise<Tweet[]> {
  const now = Date.now()

  // 如果有快取且未過期，直接回傳
  if (cachedTweets && now - lastFetchTime < CACHE_DURATION) {
    return cachedTweets
  }

  // 重新讀取資料
  try {
    cachedTweets = await fetchGoogleSheetsData()
    lastFetchTime = now
    return cachedTweets
  } catch (error) {
    console.error("讀取推文資料失敗:", error)
    // 如果有舊快取，繼續使用
    if (cachedTweets) {
      return cachedTweets
    }
    // 否則回傳空陣列
    return []
  }
}

/**
 * 為詳情頁面獲取推文資料（不包含禮物文字）
 */
export async function getTweetsForDetailPage(): Promise<Tweet[]> {
  const { SHEET_ID, API_KEY, RANGE } = GOOGLE_SHEETS_CONFIG

  // 檢查是否為測試/佔位符配置
  const isPlaceholderConfig =
    !SHEET_ID ||
    !API_KEY ||
    SHEET_ID === "your_google_sheet_id_here" ||
    API_KEY === "your_google_api_key_here" ||
    SHEET_ID.includes("example") ||
    API_KEY.includes("example")

  if (isPlaceholderConfig) {
    console.warn("Google Sheets 配置未完成或為測試配置，使用本地資料")
    // 回傳本地備份資料
    const { getTweets } = await import("../data/tweets")
    return getTweets()
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Sheets API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return parseGoogleSheetsResponseForDetail(data)
  } catch (error) {
    console.error("讀取 Google Sheets 資料失敗:", error)
    // 發生錯誤時使用本地備份資料
    const { getTweets } = await import("../data/tweets")
    return getTweets()
  }
}

// 型別定義（確保與現有的一致）
import type { Tweet } from "../data/tweets"
import { processMediaUrl } from "./media-utils"
