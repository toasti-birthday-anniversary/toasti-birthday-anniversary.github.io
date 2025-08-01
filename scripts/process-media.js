#!/usr/bin/env bun

/**
 * Script to automatically process all tweets and generate media embeddings
 * with proper chunking (max 4 media files per tweet/reply)
 */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import {
  getMediaFiles,
  splitMediaIntoChunks,
  generateMediaReplies,
  checkAvatarExists,
} from "../src/lib/media-utils"

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

async function processAllTweets() {
  console.log("🔄 Processing all tweets with media...")

  // Read current tweets data
  const tweetsPath = join(process.cwd(), "src", "data", "tweets.json")
  const rawData = readFileSync(tweetsPath, "utf-8")
  const tweetsData: TweetsData = JSON.parse(rawData)

  // Create backup
  const backupPath = join(
    process.cwd(),
    "src",
    "data",
    `tweets-backup-${Date.now()}.json`,
  )
  writeFileSync(backupPath, rawData)
  console.log(`📦 Backup created: ${backupPath}`)

  let processedCount = 0
  let mediaFilesFound = 0

  // Process each tweet
  for (const tweet of tweetsData.tweets) {
    const postId = tweet.id

    // Get all media files for this post
    const allMediaFiles = getMediaFiles(postId)

    if (allMediaFiles.length > 0) {
      console.log(`📸 Found ${allMediaFiles.length} media files for post ${postId}`)
      mediaFilesFound += allMediaFiles.length

      // Split into chunks of 4
      const mediaChunks = splitMediaIntoChunks(allMediaFiles, 4)

      // First chunk goes to main tweet
      tweet.media = mediaChunks[0] || []

      // Generate replies for additional chunks
      if (mediaChunks.length > 1) {
        const newReplies = generateMediaReplies(
          postId,
          tweet.author,
          mediaChunks,
          tweet.timestamp,
        )

        // Merge with existing replies if any
        const existingReplies = tweet.repliesData || []
        
        // Filter out old auto-generated media replies
        const manualReplies = existingReplies.filter(
          (reply) => !reply.id.includes("-reply-")
        )

        // Combine manual replies with new media replies
        tweet.repliesData = [...manualReplies, ...newReplies]
        tweet.replies = tweet.repliesData.length

        console.log(
          `  ↳ Created ${newReplies.length} additional replies for remaining media`
        )
      } else {
        // If only one chunk, keep existing manual replies
        const existingReplies = tweet.repliesData || []
        const manualReplies = existingReplies.filter(
          (reply) => !reply.id.includes("-reply-")
        )
        tweet.repliesData = manualReplies
        tweet.replies = manualReplies.length
      }

      processedCount++
    } else {
      // No media files found, clean up any auto-generated replies
      const existingReplies = tweet.repliesData || []
      const manualReplies = existingReplies.filter(
        (reply) => !reply.id.includes("-reply-")
      )
      tweet.repliesData = manualReplies.length > 0 ? manualReplies : undefined
      tweet.replies = manualReplies.length
      tweet.media = undefined
    }

    // Set avatar if exists
    if (checkAvatarExists(postId)) {
      tweet.author.avatar = `/img/${postId}/avatar.png`
    } else {
      delete tweet.author.avatar
    }
  }

  // Write updated data
  writeFileSync(tweetsPath, JSON.stringify(tweetsData, null, 2))

  console.log("✅ Processing complete!")
  console.log(`📊 Processed ${processedCount} tweets with media`)
  console.log(`📸 Total media files found: ${mediaFilesFound}`)
  console.log(`💾 Updated: ${tweetsPath}`)
}

// Run the script
processAllTweets().catch((error) => {
  console.error("❌ Error processing tweets:", error)
  process.exit(1)
})
