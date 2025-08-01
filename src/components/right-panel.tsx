"use client"

import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { trendingTopics, suggestedUsers } from "~/data/explore"
import Image from "next/image"

/**
 * Right panel component showing trending topics and suggestions
 */
export function RightPanel() {
  return (
    <div className="sticky top-0 flex h-dvh w-full flex-col overflow-y-auto">
      {/* Search - sticky within the panel */}
      <div className="bg-background/95 sticky top-0 z-10 p-4 pb-2 backdrop-blur-sm">
        <Input type="search" placeholder="發現吐司" className="w-full" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-4 px-4 pb-4">
        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">宣傳Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="hover:bg-muted/50 -m-2 cursor-pointer rounded p-2"
              >
                <p className="font-medium">{topic.tag}</p>
                <p className="text-muted-foreground text-sm">{topic.posts}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">企劃組員</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://twitch.tv/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    追蹤
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-muted-foreground space-y-2 text-xs">
          {/* <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">
              服務條款
            </a>
            <a href="#" className="hover:underline">
              隱私政策
            </a>
            <a href="#" className="hover:underline">
              Cookie 政策
            </a>
            <a href="#" className="hover:underline">
              無障礙設計
            </a>
            <a href="#" className="hover:underline">
              廣告資訊
            </a>
          </div> */}
          <p>
            &copy; 2025 吐司的森林小屋管理組 |{" "}
            <a
              href="https://github.com/toasti-birthday-anniversary/toasti-birthday-anniversary.github.io/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              查看授權
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
