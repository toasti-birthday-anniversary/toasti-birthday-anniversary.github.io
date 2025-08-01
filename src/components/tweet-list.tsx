import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { Card } from "~/components/ui/card"
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react"
import { getTweets } from "~/data/tweets"
import { MediaGrid } from "~/components/media-grid"
import { stringArrayToMediaFiles } from "~/lib/media-utils"
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
  repliesData,
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
            <AvatarImage src={author.avatar} alt={`${author.name}的頭像`} />
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
          {media && <MediaGrid files={stringArrayToMediaFiles(media)} />}

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

          {/* 回覆區域 */}
          {repliesData && repliesData.length > 0 && (
            <div className="border-border ml-8 space-y-3 border-l-2 pl-4">
              {repliesData.map((reply) => (
                <div key={reply.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">
                      {reply.author.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      @{reply.author.username}
                    </span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="text-sm">{reply.content}</p>
                  {reply.media && reply.media.length > 0 && (
                    <MediaGrid files={stringArrayToMediaFiles(reply.media)} />
                  )}
                  <div className="text-muted-foreground text-xs">
                    <Heart className="mr-1 inline h-3 w-3" />
                    {reply.likes}
                  </div>
                </div>
              ))}
            </div>
          )}
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

  const loadTweets = async () => {
    try {
      const tweetsData = getTweets()
      setTweets(tweetsData)
    } catch (error) {
      console.error("載入推文失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTweets()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    )
  }

  return (
    <div className="divide-border divide-y">
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
