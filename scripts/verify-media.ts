#!/usr/bin/env bun

/**
 * 驗證 tweets.json 中的頭像和媒體檔案設定
 */

import { readFileSync } from "fs"
import { join } from "path"

const tweetsPath = join(process.cwd(), "src", "data", "tweets.json")
const tweetsData = JSON.parse(readFileSync(tweetsPath, "utf-8"))

console.log("🔍 驗證推文資料...")

let avatarCount = 0
let mediaCount = 0
let replyMediaCount = 0

for (const tweet of tweetsData.tweets) {
  const id = tweet.id

  // 檢查頭像
  if (tweet.author.avatar) {
    avatarCount++
    console.log(`👤 ID ${id}: 頭像 ${tweet.author.avatar}`)
  }

  // 檢查媒體檔案
  if (tweet.media && tweet.media.length > 0) {
    mediaCount += tweet.media.length
    console.log(`📸 ID ${id}: ${tweet.media.length} 個媒體檔案`)
    tweet.media.forEach((media: string, index: number) => {
      console.log(`   ${index + 1}. ${media}`)
    })
  }

  // 檢查回覆中的媒體檔案
  if (tweet.repliesData) {
    for (const reply of tweet.repliesData) {
      if (reply.media && reply.media.length > 0) {
        replyMediaCount += reply.media.length
        console.log(
          `💬 ID ${id} 回覆 ${reply.id}: ${reply.media.length} 個媒體檔案`,
        )
        reply.media.forEach((media: string, index: number) => {
          console.log(`   ${index + 1}. ${media}`)
        })
      }
    }
  }
}

console.log("\n📊 統計結果:")
console.log(`👤 設定頭像的推文: ${avatarCount}`)
console.log(`📸 主推文媒體檔案總數: ${mediaCount}`)
console.log(`💬 回覆媒體檔案總數: ${replyMediaCount}`)
console.log(`🎯 總媒體檔案數: ${mediaCount + replyMediaCount}`)
