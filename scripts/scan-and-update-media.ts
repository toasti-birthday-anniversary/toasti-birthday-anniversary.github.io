#!/usr/bin/env bun

/**
 * 掃描 public/img 目錄並更新 tweets.json 中的媒體檔案和頭像路徑
 * 這個腳本在建構時期執行，把所有檔案路徑寫進 JSON 資料中
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs"
import { join } from "path"

interface TweetAuthor {
  name: string
  username: string
  avatar?: string
}

interface TweetReply {
  id: string
  author: TweetAuthor
  content: string
  timestamp: string
  likes: number
  media?: string[]
}

interface Tweet {
  id: string
  author: TweetAuthor
  content: string
  timestamp: string
  likes: number
  retweets: number
  replies: number
  isLiked?: boolean
  isRetweeted?: boolean
  media?: string[]
  repliesData?: TweetReply[]
}

interface TweetsData {
  tweets: Tweet[]
}

/**
 * 掃描指定 ID 的媒體檔案
 */
function scanMediaFiles(postId: string): string[] {
  const mediaDir = join(process.cwd(), "public", "img", postId)

  if (!existsSync(mediaDir)) {
    return []
  }

  const files = readdirSync(mediaDir)
  const mediaFiles: string[] = []

  // 找出所有以數字開頭的媒體檔案 (00, 01, 02, etc.)
  const mediaPattern = /^(\d{2})\.(png|jpg|jpeg|gif|mp4|webm)$/i

  files
    .filter((file) => mediaPattern.test(file))
    .sort() // 按檔名排序
    .forEach((file) => {
      mediaFiles.push(`/img/${postId}/${file}`)
    })

  return mediaFiles
}

/**
 * 檢查頭像是否存在
 */
function checkAvatar(postId: string): string | undefined {
  const avatarPath = join(process.cwd(), "public", "img", postId, "avatar.png")
  return existsSync(avatarPath) ? `/img/${postId}/avatar.png` : undefined
}

/**
 * 將媒體檔案分塊 (每塊最多 4 個)
 */
function splitIntoChunks(files: string[], chunkSize = 4): string[][] {
  const chunks: string[][] = []
  for (let i = 0; i < files.length; i += chunkSize) {
    chunks.push(files.slice(i, i + chunkSize))
  }
  return chunks
}

async function updateTweetsWithMedia() {
  console.log("🔄 掃描 public/img 目錄並更新 tweets.json...")

  // 讀取現有的 tweets 資料
  const tweetsPath = join(process.cwd(), "src", "data", "tweets.json")
  const rawData = readFileSync(tweetsPath, "utf-8")
  const tweetsData: TweetsData = JSON.parse(rawData)

  // 建立備份
  const backupPath = join(
    process.cwd(),
    "src",
    "data",
    `tweets-backup-${Date.now()}.json`,
  )
  writeFileSync(backupPath, rawData)
  console.log(`📦 建立備份: ${backupPath}`)

  let processedCount = 0
  let totalMediaFiles = 0

  // 處理每個推文
  for (const tweet of tweetsData.tweets) {
    const postId = tweet.id

    // 掃描媒體檔案
    const mediaFiles = scanMediaFiles(postId)

    // 檢查頭像
    const avatar = checkAvatar(postId)
    if (avatar) {
      tweet.author.avatar = avatar
      console.log(`👤 設定頭像: ${postId}`)
    } else {
      delete tweet.author.avatar
    }

    if (mediaFiles.length > 0) {
      console.log(`📸 ID ${postId}: 找到 ${mediaFiles.length} 個媒體檔案`)
      totalMediaFiles += mediaFiles.length

      // 分塊處理
      const chunks = splitIntoChunks(mediaFiles, 4)

      // 主推文使用第一塊
      tweet.media = chunks[0] || []

      // 清除舊的自動生成回覆
      const existingReplies = tweet.repliesData || []
      const manualReplies = existingReplies.filter(
        (reply) => !reply.id.includes("-reply-"),
      )

      // 為剩餘的媒體檔案建立回覆
      if (chunks.length > 1) {
        const mediaReplies: TweetReply[] = []

        for (let i = 1; i < chunks.length; i++) {
          mediaReplies.push({
            id: `${postId}-reply-${i}`,
            author: {
              name: tweet.author.name,
              username: tweet.author.username,
              ...(avatar && { avatar }),
            },
            content: "", // 純媒體回覆沒有文字內容
            timestamp: tweet.timestamp,
            likes: Math.floor(Math.random() * 10),
            media: chunks[i],
          })
        }

        tweet.repliesData = [...manualReplies, ...mediaReplies]
        console.log(`  ↳ 建立 ${mediaReplies.length} 個媒體回覆`)
      } else {
        tweet.repliesData = manualReplies.length > 0 ? manualReplies : undefined
      }

      // 更新回覆數量
      tweet.replies = (tweet.repliesData || []).length
      processedCount++
    } else {
      // 沒有媒體檔案，清理自動生成的回覆
      const existingReplies = tweet.repliesData || []
      const manualReplies = existingReplies.filter(
        (reply) => !reply.id.includes("-reply-"),
      )

      tweet.media = undefined
      tweet.repliesData = manualReplies.length > 0 ? manualReplies : undefined
      tweet.replies = manualReplies.length
    }
  }

  // 寫入更新後的資料
  writeFileSync(tweetsPath, JSON.stringify(tweetsData, null, 2))

  console.log("✅ 處理完成!")
  console.log(`📊 處理了 ${processedCount} 個有媒體的推文`)
  console.log(`📸 總共找到 ${totalMediaFiles} 個媒體檔案`)
  console.log(`💾 已更新: ${tweetsPath}`)
}

// 執行腳本
updateTweetsWithMedia().catch((error) => {
  console.error("❌ 處理過程中發生錯誤:", error)
  process.exit(1)
})
