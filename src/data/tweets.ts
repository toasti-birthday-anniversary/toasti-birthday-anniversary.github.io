import tweetsData from "./tweets.json"

/**
 * Tweet author info
 */
export interface TweetAuthor {
  name: string
  username: string
  avatar?: string // 本地路徑
}

/**
 * 留言（回覆）
 */
export interface TweetReply {
  id: string
  author: TweetAuthor
  content: string
  timestamp: string
  likes: number
  media?: string[] // 改為字串陣列
}

/**
 * Tweet 結構
 */
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
  media?: string[] // 改為字串陣列
  repliesData?: TweetReply[] // 新增回覆資料欄位
}

/**
 * 取得所有 tweets，資料已經預處理過了
 * @returns 按 id 降序排列的 tweets（最新的在前面）
 */
export function getTweets(): Tweet[] {
  return tweetsData.tweets
    .map((tweet) => ({
      ...tweet,
      // 直接使用 JSON 中的 author 資料，不要覆蓋
    }))
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
}

// 舊 API 兼容
export const sampleTweets: Tweet[] = getTweets()
