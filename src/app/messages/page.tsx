"use client"

import { PageHeader } from "~/components/page-header"
import { Card, CardContent } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

interface User {
  id: string
  name: string
  username: string
  avatar?: string
}

interface MessageConversation {
  id: string
  user: User
  lastMessage: string
  timestamp: string
  unread: boolean
}

/**
 * Individual message conversation component
 */
function Conversation({
  user,
  lastMessage,
  timestamp,
  unread,
}: MessageConversation) {
  return (
    <Card className="border-border hover:bg-muted/50 cursor-pointer rounded-none border-x-0 border-t-0 transition-colors">
      <CardContent className="flex items-center space-x-3 p-3 sm:p-4">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${unread ? "font-bold" : ""}`}>
              {user.name}
            </h3>
            <span className="text-muted-foreground text-sm">{timestamp}</span>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-muted-foreground truncate text-sm ${unread ? "text-foreground font-medium" : ""}`}
            >
              {lastMessage}
            </p>
            {unread && (
              <div className="bg-primary ml-2 h-2 w-2 rounded-full"></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Messages page component
 */
export default function Messages() {
  // Mock data - replace with actual data in the future
  const conversations: MessageConversation[] = []

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="訊息" />

      {/* Search */}
      <div className="border-border border-b p-4">
        <Input type="search" placeholder="搜尋對話" className="w-full" />
      </div>

      {/* Conversations List */}
      <div className="divide-border flex-1 divide-y">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <Conversation key={conversation.id} {...conversation} />
          ))
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <span className="mb-4 text-4xl">💬</span>
            <h3 className="mb-2 text-lg font-medium">尚無對話</h3>
            <p className="text-center">開始與朋友聊天，分享你的特別時刻！</p>
            <Button className="mt-4">開始對話</Button>
          </div>
        )}
      </div>

      {/* Floating Compose Button - Desktop only, mobile has FAB */}
      <div className="fixed right-6 bottom-6 hidden md:block">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          ✏️
        </Button>
      </div>
    </div>
  )
}
