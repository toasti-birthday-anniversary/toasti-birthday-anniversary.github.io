import { notFound } from "next/navigation"
import { PageHeader } from "~/components/page-header"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react"
import { getTweets } from "~/data/tweets"
import { MediaGrid } from "~/components/media-grid"
import { stringArrayToMediaFiles } from "~/lib/media-utils"
import type { Tweet } from "~/data/tweets"
import { TweetComposer } from "~/components/tweet-composer"

interface TweetPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generate static paths for all tweets
 */
export async function generateStaticParams() {
  try {
    const tweets = getTweets()
    return tweets.map((tweet: Tweet) => ({
      id: tweet.id,
    }))
  } catch (error) {
    console.error("生成靜態路徑失敗:", error)
    return []
  }
}

/**
 * Individual tweet detail component
 */
function TweetDetail({
  author,
  content,
  timestamp,
  likes,
  retweets,
  replies,
  isLiked = false,
  isRetweeted = false,
  media,
}: Tweet) {
  return (
    <Card className="border-border rounded-none border-x-0 border-t-0">
      <div className="space-y-4 p-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            {author.avatar && (
              <AvatarImage src={author.avatar} alt={`${author.name}的頭像`} />
            )}
            <AvatarFallback className="text-lg">
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{author.name}</h3>
            <span className="text-muted-foreground">@{author.username}</span>
          </div>
        </div>

        {/* Tweet Content */}
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* 媒體顯示區域 - 使用 Twitter 風格網格 */}
        {media && <MediaGrid files={stringArrayToMediaFiles(media)} />}

        {/* Timestamp */}
        <div className="text-muted-foreground border-border border-b pb-4 text-sm">
          {timestamp}
        </div>

        {/* Stats */}
        <div className="text-muted-foreground border-border flex space-x-6 border-b pb-4 text-sm">
          <span>
            <strong className="text-foreground">{retweets}</strong> 轉推
          </span>
          <span>
            <strong className="text-foreground">{likes}</strong> 喜歡
          </span>
          <span>
            <strong className="text-foreground">{replies}</strong> 回覆
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around pt-2">
          <Button variant="ghost" size="lg" className="hover:text-blue-500">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className={`hover:text-green-500 ${isRetweeted ? "text-green-500" : ""}`}
          >
            <Repeat2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className={`hover:text-red-500 ${isLiked ? "text-red-500" : ""}`}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="lg" className="hover:text-blue-500">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

/**
 * Tweet detail page
 */
export default async function TweetPage({ params }: TweetPageProps) {
  const { id } = await params
  const tweets = getTweets()
  const tweet = tweets.find((t: Tweet) => t.id === id)

  if (!tweet) {
    notFound()
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="貼文" showBack />

      <div className="flex-1">
        {/* Tweet Detail */}
        <TweetDetail {...tweet} />

        {/* Reply Composer */}
        <div className="border-border border-t p-4">
          <h3 className="mb-4 text-lg font-semibold">
            回覆 @{tweet.author.username}
          </h3>
          <TweetComposer placeholder="推文你的回覆" />
        </div>

        {/* Replies - Use data from JSON */}
        {tweet.repliesData && tweet.repliesData.length > 0 && (
          <div className="border-border divide-border divide-y border-t">
            {tweet.repliesData.map((reply) => (
              <div key={reply.id} className="p-4">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    {reply.author.avatar && (
                      <AvatarImage
                        src={reply.author.avatar}
                        alt={`${reply.author.name}的頭像`}
                      />
                    )}
                    <AvatarFallback>
                      {reply.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{reply.author.name}</span>
                      <span className="text-muted-foreground">
                        @{reply.author.username}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground text-sm">
                        {reply.timestamp}
                      </span>
                    </div>

                    {/* Reply content */}
                    {reply.content && (
                      <p className="mt-2 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    )}

                    {/* Reply media */}
                    {reply.media && reply.media.length > 0 && (
                      <div className="mt-3">
                        <MediaGrid
                          files={stringArrayToMediaFiles(reply.media)}
                        />
                      </div>
                    )}

                    {/* Reply actions */}
                    <div className="text-muted-foreground mt-3 flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-blue-500"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />0
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-green-500"
                      >
                        <Repeat2 className="mr-2 h-4 w-4" />0
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-red-500"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        {reply.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-blue-500"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
