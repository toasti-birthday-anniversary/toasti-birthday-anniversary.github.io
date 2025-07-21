import tweetsData from "./birthday-tweets.json"

export interface TweetAuthor {
  name: string
  username: string
  avatar?: string
}

export interface Tweet {
  id: string
  author: TweetAuthor
  content: string
  timestamp: string
  likes: number
  retweets: number
  replies: number
  isLiked?: boolean
  isRetweeted?: boolean
  media?: {
    url: string
    type: "image" | "video" | "unknown"
    allFiles?: Array<{ url: string; type: "image" | "video" | "unknown" }>
  }
}

/**
 * Get all tweets
 * @returns Array of all tweets
 */
export function getTweets(): Tweet[] {
  return tweetsData.tweets as Tweet[]
}

// Export data for backward compatibility
export const sampleTweets: Tweet[] = tweetsData.tweets as Tweet[]
