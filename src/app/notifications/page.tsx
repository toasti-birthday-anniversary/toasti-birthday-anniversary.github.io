"use client"

import { PageHeader } from "~/components/page-header"
import { Card, CardContent } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  Heart,
  Repeat2,
  UserPlus,
  MessageCircle,
  Cake,
  Bell,
} from "lucide-react"

interface User {
  id: string
  name: string
  username: string
  avatar?: string
}

interface Notification {
  id: string
  type: "like" | "retweet" | "follow" | "mention" | "birthday" | "anniversary"
  user: User
  content?: string
  tweet?: {
    id: string
    excerpt: string
  }
  timestamp: string
  isRead: boolean
}

/**
 * Individual notification component
 */
function Notification({
  type,
  user,
  content,
  timestamp,
  isRead = false,
}: Notification) {
  const getNotificationIcon = () => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "retweet":
        return <Repeat2 className="h-5 w-5 text-green-500" />
      case "follow":
        return <UserPlus className="h-5 w-5 text-blue-500" />
      case "mention":
        return <MessageCircle className="h-5 w-5 text-purple-500" />
      case "birthday":
        return <Cake className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationText = () => {
    switch (type) {
      case "like":
        return "喜歡了你的貼文"
      case "retweet":
        return "轉推了你的貼文"
      case "follow":
        return "開始追蹤你"
      case "mention":
        return "在貼文中提到了你"
      case "birthday":
        return "的生日就是今天！"
      default:
        return "通知"
    }
  }

  return (
    <Card
      className={`border-border rounded-none border-x-0 border-t-0 ${!isRead ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
    >
      <CardContent className="flex items-start space-x-3 p-4">
        <div className="flex-shrink-0">{getNotificationIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground ml-1">
                {getNotificationText()}
              </span>
            </div>
          </div>
          {content && (
            <p className="text-muted-foreground mt-2 text-sm">{content}</p>
          )}
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        </div>
        {type === "follow" && (
          <Button size="sm" variant="outline">
            追蹤
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Notifications page component
 */
export default function Notifications() {
  // Mock data - replace with actual data in the future
  const notifications: Notification[] = []

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="通知" />

      <div className="divide-border divide-y">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification key={notification.id} {...notification} />
          ))
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <span className="mb-4 text-4xl">🔔</span>
            <h3 className="mb-2 text-lg font-medium">尚無通知</h3>
            <p className="text-center">當有新的互動時，通知會顯示在這裡。</p>
          </div>
        )}
      </div>
    </div>
  )
}
