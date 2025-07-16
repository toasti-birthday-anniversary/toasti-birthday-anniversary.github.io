"use client"

import { PageHeader } from "~/components/page-header"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { TweetList } from "~/components/tweet-list"
import { getCurrentUserProfile, getProfileTabs } from "~/data/profile"

/**
 * Profile page component
 */
export default function Profile() {
  const profileData = getCurrentUserProfile()
  const profileTabs = getProfileTabs(profileData)

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title={profileData.name} showBack />

      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 w-full bg-gradient-to-r from-blue-400 to-purple-500"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="relative -mt-16 mb-4">
            <Avatar className="border-background h-24 w-24 border-4">
              <AvatarFallback className="text-2xl">
                {profileData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">@{profileData.username}</p>
            </div>
            <Button variant="outline">編輯個人檔案</Button>
          </div>

          <div className="mt-3 space-y-2">
            <p>{profileData.bio}</p>
            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
              <span>📍 {profileData.location}</span>
              <span>📅 {profileData.joinDate} 加入</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                <strong>{profileData.following}</strong>
                <span className="text-muted-foreground ml-1">追蹤中</span>
              </span>
              <span>
                <strong>{profileData.followers}</strong>
                <span className="text-muted-foreground ml-1">追蹤者</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="tweets" className="flex-1">
        <TabsList className="border-border grid w-full grid-cols-3 border-b">
          {profileTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="tweets">
          <TweetList />
        </TabsContent>

        <TabsContent value="media">
          <div className="text-muted-foreground py-8 text-center">
            <p>尚無媒體內容</p>
          </div>
        </TabsContent>

        <TabsContent value="likes">
          <div className="text-muted-foreground py-8 text-center">
            <p>尚無喜歡的貼文</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
