import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { Card } from "~/components/ui/card"
import { MessageCircle, Repeat2, Heart, Share, RefreshCw } from "lucide-react"
import { getTweetsWithCache } from "~/lib/google-sheets"
import { MediaGrid } from "~/components/media-grid"
import { processAvatarUrl } from "~/lib/media-utils"
import type { Tweet as TweetType } from "~/data/tweets"

/**
 * Individual tweet component
 */
function Tweet({
  id,
  author,
  content,
  timestamp,
  likes,
  retweets,
  replies,
  isLiked = false,
  isRetweeted = false,
  media,
}: TweetType) {
  const router = useRouter()

  const handleTweetClick = () => {
    router.push(`/tweet/${id}`)
  }

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking action buttons
  }

  return (
    <Card
      className="border-border hover:bg-muted/50 cursor-pointer rounded-none border-x-0 border-t-0 transition-colors"
      onClick={handleTweetClick}
    >
      <div className="flex space-x-3 p-3">
        <Avatar>
          {author.avatar && (
            <AvatarImage
              src={processAvatarUrl(author.avatar)}
              alt={`${author.name}的頭像`}
            />
          )}
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold">{author.name}</h3>
            <span className="text-muted-foreground">@{author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">{timestamp}</span>
          </div>

          <p className="whitespace-pre-wrap">{content}</p>

          {/* 媒體顯示區域 - 使用 Twitter 風格網格 */}
          {media && (
            <MediaGrid
              files={media.allFiles || [{ url: media.url, type: media.type }]}
            />
          )}

          <div className="text-muted-foreground flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-blue-500"
              onClick={handleActionClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {replies}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`hover:text-green-500 ${isRetweeted ? "text-green-500" : ""}`}
              onClick={handleActionClick}
            >
              <Repeat2 className="mr-2 h-4 w-4" />
              {retweets}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`hover:text-red-500 ${isLiked ? "text-red-500" : ""}`}
              onClick={handleActionClick}
            >
              <Heart className="mr-2 h-4 w-4" />
              {likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-blue-500"
              onClick={handleActionClick}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Tweet list component displaying a feed of tweets
 */
export function TweetList() {
  const [tweets, setTweets] = useState<TweetType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dataSource, setDataSource] = useState<"google" | "local">("local")

  const loadTweets = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const tweetsData = await getTweetsWithCache()
      setTweets(tweetsData)

      // 檢查是否有 Google API 配置來判斷資料來源
      const hasGoogleConfig =
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_API_KEY &&
        process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID !==
          "your_google_sheet_id_here" &&
        process.env.NEXT_PUBLIC_GOOGLE_API_KEY !== "your_google_api_key_here"

      setDataSource(hasGoogleConfig ? "google" : "local")
    } catch (error) {
      console.error("載入推文失敗:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadTweets()
  }, [])

  const handleRefresh = () => {
    loadTweets(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    )
  }

  return (
    <div className="divide-border divide-y">
      {/* 資料來源指示器 */}
      <div className="bg-muted/30 text-muted-foreground flex items-center justify-between p-3 text-sm">
        <div className="flex items-center space-x-2">
          <span>
            資料來源：
            {dataSource === "google" ? "🌐 Google 表單（即時）" : "📁 本地備份"}
          </span>
        </div>
        {dataSource === "google" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 px-2"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="ml-1">
              {isRefreshing ? "更新中..." : "重新整理"}
            </span>
          </Button>
        )}
      </div>

      {tweets.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">尚未有任何祝福訊息</div>
        </div>
      ) : (
        tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
      )}
    </div>
  )
}
