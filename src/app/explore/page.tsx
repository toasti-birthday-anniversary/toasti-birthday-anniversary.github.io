"use client"

import { PageHeader } from "~/components/page-header"
import { Input } from "~/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"

/**
 * Explore page component for discovering content
 */
export default function Explore() {
  const trendingTopics = [
    { tag: "#生日快樂", posts: "1.2K", description: "今天有很多人在慶祝生日" },
    { tag: "#週年紀念", posts: "856", description: "各種週年紀念日慶祝" },
    { tag: "#慶祝", posts: "2.3K", description: "分享快樂時光" },
    { tag: "#結婚週年", posts: "543", description: "甜蜜的結婚紀念日" },
    { tag: "#畢業紀念", posts: "432", description: "畢業季的回憶" },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="探索" />

      <div className="p-4">
        <Input type="search" placeholder="搜尋 Toasti" className="mb-4" />

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">熱門</TabsTrigger>
            <TabsTrigger value="latest">最新</TabsTrigger>
            <TabsTrigger value="media">媒體</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <Card key={index} className="hover:bg-muted/50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">熱門話題</p>
                      <h3 className="font-bold">{topic.tag}</h3>
                      <p className="text-muted-foreground text-sm">
                        {topic.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {topic.posts} 則貼文
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="latest">
            <div className="text-muted-foreground py-8 text-center">
              <p>最新內容即將推出</p>
            </div>
          </TabsContent>

          <TabsContent value="media">
            <div className="text-muted-foreground py-8 text-center">
              <p>媒體內容即將推出</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
