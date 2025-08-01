#!/usr/bin/env bun

/**
 * Quick script to process a specific tweet ID and its media files
 * Usage: bun run scripts/process-single-tweet.ts <tweetId>
 */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import {
  getMediaFiles,
  splitMediaIntoChunks,
  generateMediaReplies,
  checkAvatarExists,
} from "../src/lib/media-utils"

const tweetId = process.argv[2]

if (!tweetId) {
  console.error("❌ Please provide a tweet ID")
  console.log("Usage: bun run scripts/process-single-tweet.ts <tweetId>")
  process.exit(1)
}

async function processSingleTweet(id: string) {
  console.log(`🔄 Processing tweet ${id}...`)

  // Read current tweets data
  const tweetsPath = join(process.cwd(), "src", "data", "tweets.json")
  const rawData = readFileSync(tweetsPath, "utf-8")
  const tweetsData = JSON.parse(rawData)

  // Find the tweet
  const tweet = tweetsData.tweets.find((t: any) => t.id === id)
  if (!tweet) {
    console.error(`❌ Tweet with ID ${id} not found`)
    process.exit(1)
  }

  // Get all media files for this post
  const allMediaFiles = getMediaFiles(id)

  if (allMediaFiles.length > 0) {
    console.log(`📸 Found ${allMediaFiles.length} media files`)
    console.log("Files:", allMediaFiles)

    // Split into chunks of 4
    const mediaChunks = splitMediaIntoChunks(allMediaFiles, 4)
    console.log(`📦 Split into ${mediaChunks.length} chunks`)

    // First chunk goes to main tweet
    tweet.media = mediaChunks[0] || []

    // Generate replies for additional chunks
    if (mediaChunks.length > 1) {
      const newReplies = generateMediaReplies(
        id,
        tweet.author,
        mediaChunks,
        tweet.timestamp,
      )

      // Keep existing manual replies
      const existingReplies = tweet.repliesData || []
      const manualReplies = existingReplies.filter(
        (reply: any) => !reply.id.includes("-reply-"),
      )

      tweet.repliesData = [...manualReplies, ...newReplies]
      tweet.replies = tweet.repliesData.length

      console.log(`✅ Created ${newReplies.length} additional replies`)
    }
  } else {
    console.log("📭 No media files found")
    tweet.media = undefined
  }

  // Set avatar if exists
  if (checkAvatarExists(id)) {
    tweet.author.avatar = `/img/${id}/avatar.png`
    console.log("👤 Avatar found and set")
  } else {
    delete tweet.author.avatar
    console.log("👤 No avatar found")
  }

  // Write updated data
  writeFileSync(tweetsPath, JSON.stringify(tweetsData, null, 2))
  console.log(`💾 Updated: ${tweetsPath}`)
}

processSingleTweet(tweetId).catch((error) => {
  console.error("❌ Error processing tweet:", error)
  process.exit(1)
})
