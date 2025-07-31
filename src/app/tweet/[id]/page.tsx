import { notFound } from "next/navigation"
import { PageHeader } from "~/components/page-header"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MessageCircle, Repeat2, Heart, Share } from "lucide-react"
import { getTweetsForDetailPage } from "~/lib/google-sheets"
import { MediaGrid } from "~/components/media-grid"
import { processAvatarUrl } from "~/lib/media-utils"
import type { Tweet } from "~/data/tweets"
import { TweetComposer } from "~/components/tweet-composer"

interface TweetPageProps {
  params: Promise<{ id: string }>
}

/**
 * Check if replies should be shown for this specific user
 * Uses multiple criteria to identify the target user safely
 */
function shouldShowRepliesForUser(
  author: {
    name: string
    username: string
  },
  tweetId?: string,
): boolean {
  // Check by tweet ID first (if provided and matches)
  if (tweetId === "32") {
    return true
  }

  // Check by various identifiers that are less likely to change
  const targetIdentifiers = [
    "罐頭", // Name contains
    // Add more identifiers as needed
  ]

  const authorNameLower = author.name.toLowerCase()
  const authorUsernameLower = author.username.toLowerCase()

  return targetIdentifiers.some(
    (identifier) =>
      authorNameLower.includes(identifier.toLowerCase()) ||
      authorUsernameLower.includes(identifier.toLowerCase()),
  )
}

/**
 * Generate static paths for all tweets
 */
export async function generateStaticParams() {
  try {
    const tweets = await getTweetsForDetailPage()
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
              <AvatarImage
                src={processAvatarUrl(author.avatar)}
                alt={`${author.name}的頭像`}
              />
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
        {media && (
          <MediaGrid
            files={media.allFiles || [{ url: media.url, type: media.type }]}
          />
        )}

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
  const tweets = await getTweetsForDetailPage()
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

        {/* Mock Replies - Show only for specific user */}
        {shouldShowRepliesForUser(tweet.author, tweet.id) && (
          <div className="border-border divide-border divide-y border-t">
            {/* 第一到第五留言，每組包含指定的圖片 */}
            {[
              ["00.png", "01.png", "02.png", "03.png"],
              ["04.png", "05.png", "06.png", "07.png"],
              ["08.png", "09.png", "10.png", "11.png"],
              ["12.png", "13.png", "14.png", "15.png"],
              ["16.png", "17.png", "18.png", "19.png"],
            ].map((images, index) => (
              <div key={index} className="p-4">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    {tweet.author.avatar && (
                      <AvatarImage
                        src={processAvatarUrl(tweet.author.avatar)}
                        alt={`${tweet.author.name}的頭像`}
                      />
                    )}
                    <AvatarFallback>
                      {tweet.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{tweet.author.name}</span>
                      <span className="text-muted-foreground">
                        @{tweet.author.username}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground text-sm">
                        1小時
                      </span>
                    </div>

                    {/* 圖片網格 */}
                    <div className="mt-3">
                      <MediaGrid
                        files={images.map((image) => ({
                          url: `/img/${image}`,
                          type: "image",
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 第六留言，包含兩張圖片 */}
            <div className="p-4">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  {tweet.author.avatar && (
                    <AvatarImage
                      src={processAvatarUrl(tweet.author.avatar)}
                      alt={`${tweet.author.name}的頭像`}
                    />
                  )}
                  <AvatarFallback>{tweet.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{tweet.author.name}</span>
                    <span className="text-muted-foreground">
                      @{tweet.author.username}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground text-sm">1小時</span>
                  </div>

                  {/* 圖片網格 */}
                  <div className="mt-3">
                    <MediaGrid
                      files={[
                        { url: "/img/20.png", type: "image" },
                        { url: "/img/21.png", type: "image" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
