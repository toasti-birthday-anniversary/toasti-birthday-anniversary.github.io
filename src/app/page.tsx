"use client"

import { TweetComposer } from "~/components/tweet-composer"
import { TweetList } from "~/components/tweet-list"
import { PageHeader } from "~/components/page-header"

/**
 * Home page component displaying the main timeline
 */
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader title="首頁" />
      <TweetComposer />
      <TweetList />
    </div>
  )
}
