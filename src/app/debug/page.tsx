"use client"

import Image from "next/image"
import { getTweets } from "~/data/tweets"

export default function DebugPage() {
  const tweets = getTweets()

  // 找出前幾個有媒體檔案和頭像的推文
  const tweetsWithMedia = tweets
    .filter((tweet) => tweet.media?.length || tweet.author.avatar)
    .slice(0, 3)

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">除錯頁面</h1>

      {tweetsWithMedia.map((tweet) => (
        <div key={tweet.id} className="mb-4 rounded border p-4">
          <h2 className="font-bold">推文 ID: {tweet.id}</h2>

          <div className="mt-2">
            <strong>作者頭像:</strong> {tweet.author.avatar || "無頭像"}
          </div>

          {tweet.author.avatar && (
            <div className="mt-2">
              <Image
                src={tweet.author.avatar}
                alt="頭像"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full"
                onError={(e) => {
                  console.error("頭像載入失敗:", tweet.author.avatar)
                  e.currentTarget.style.border = "2px solid red"
                }}
              />
            </div>
          )}

          <div className="mt-2">
            <strong>媒體檔案:</strong> {tweet.media?.length || 0} 個
          </div>

          {tweet.media?.map((mediaUrl, index) => (
            <div key={index} className="mt-2">
              <div>
                檔案 {index + 1}: {mediaUrl}
              </div>
              <Image
                src={mediaUrl}
                alt={`媒體 ${index + 1}`}
                width={128}
                height={128}
                className="h-32 w-32 border object-cover"
                onError={(e) => {
                  console.error("媒體載入失敗:", mediaUrl)
                  e.currentTarget.style.border = "2px solid red"
                }}
              />
            </div>
          ))}

          <div className="mt-2">
            <strong>回覆數:</strong> {tweet.repliesData?.length || 0}
          </div>
        </div>
      ))}
    </div>
  )
}
