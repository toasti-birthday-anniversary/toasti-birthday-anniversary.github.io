import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 讀取現有的 tweets.json 來取得 avatar 和 media 設定
const tweetsJsonPath = path.join(__dirname, "../src/data/tweets.json")
const existingData = JSON.parse(fs.readFileSync(tweetsJsonPath, "utf-8"))

// 建立 username -> 資料的對應表，用來保留 avatar 和 media
const existingTweetMap = new Map()
existingData.tweets.forEach((tweet) => {
  existingTweetMap.set(tweet.author.name, {
    avatar: tweet.author.avatar,
    media: tweet.media,
  })
})

// 讀取 CSV 檔案
const csvPath = path.join(
  __dirname,
  "../偷偷祝福吐司生日與一週年! (回覆) - 表單回應 1.csv",
)
const csvContent = fs.readFileSync(csvPath, "utf-8")

// 解析 CSV 內容
const lines = csvContent.split("\n").filter((line) => line.trim())
const header = lines[0]
const dataLines = lines.slice(1) // 跳過標題行

console.log(`找到 ${dataLines.length} 筆資料`)

// 處理每一行資料
const rawTweets = []
dataLines.forEach((line) => {
  // 簡單的 CSV 解析（處理逗號分隔）
  const fields = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current.trim()) // 加入最後一個欄位

  if (fields.length >= 4) {
    const timestamp = fields[0]
    const name = fields[1]
    const avatarUrl = fields[2] // Google Drive URL（我們會忽略）
    const content = fields[3]
    const mediaUrls = fields[4] || "" // Google Drive URLs（我們會忽略）

    // 跳過空的名字
    if (!name.trim()) return

    rawTweets.push({
      name,
      content,
      timestamp,
      avatarUrl,
      mediaUrls,
    })
  }
})

// 倒敘排列（最新的在前面，最舊的在後面）
rawTweets.reverse()

// 生成最終的 tweets 陣列
const tweets = rawTweets.map((rawTweet, index) => {
  const id = String(index + 1) // ID 從 1 開始

  // 取得現有的 avatar 和 media 設定
  const existing = existingTweetMap.get(rawTweet.name) || {}

  const tweet = {
    id,
    author: {
      name: rawTweet.name,
      username: `user${id}`,
      avatar: existing.avatar || `/img/${id}/avatar.png`,
    },
    content: rawTweet.content,
    timestamp: rawTweet.timestamp,
    likes: Math.floor(Math.random() * 50) + 1,
    retweets: Math.floor(Math.random() * 10),
    replies: 0,
    isLiked: Math.random() > 0.7,
    isRetweeted: Math.random() > 0.8,
  }

  // 如果有現有的 media，加入
  if (existing.media && existing.media.length > 0) {
    tweet.media = existing.media
  }

  return tweet
})

// 資料現在是倒敘（最新在前），符合要求
console.log(`處理完成，共 ${tweets.length} 筆貼文`)
console.log(
  `第一筆（最新）: ${tweets[0]?.author.name} - ${tweets[0]?.timestamp}`,
)
console.log(
  `最後一筆（最舊）: ${tweets[tweets.length - 1]?.author.name} - ${tweets[tweets.length - 1]?.timestamp}`,
)

// 寫入新的 tweets.json
const newData = {
  tweets,
}

fs.writeFileSync(tweetsJsonPath, JSON.stringify(newData, null, 2), "utf-8")
console.log(`已更新 ${tweetsJsonPath}`)
console.log(`總共寫入 ${tweets.length} 筆貼文資料`)
