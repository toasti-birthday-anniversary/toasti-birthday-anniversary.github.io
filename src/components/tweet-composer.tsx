"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Card } from "~/components/ui/card"
import { Camera, Video, BarChart3, Smile, Calendar } from "lucide-react"

/**
 * Tweet composer component for creating new posts
 */
interface TweetComposerProps {
  placeholder?: string
}

export function TweetComposer({
  placeholder = "有什麼特別的日子想分享嗎？",
}: TweetComposerProps) {
  const [content, setContent] = useState("")
  const maxLength = 280

  const handleSubmit = () => {
    if (content.trim()) {
      // TODO: Handle tweet submission
      console.log("Tweet submitted:", content)
      setContent("")
    }
  }

  return (
    <Card className="border-border rounded-none border-x-0 border-t-0">
      <div className="flex space-x-3 p-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="placeholder:text-muted-foreground min-h-20 resize-none border-none text-xl focus-visible:ring-0"
            maxLength={maxLength}
          />

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Camera className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Smile className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`text-sm ${content.length > maxLength * 0.8 ? "text-orange-500" : "text-muted-foreground"}`}
              >
                {maxLength - content.length}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > maxLength}
                size="sm"
              >
                發布
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
