import exploreData from "./explore.json"

export interface TrendingTopic {
  tag: string
  posts: string
}

export interface SuggestedUser {
  name: string
  username: string
  avatar: string
}

/**
 * Get trending topics
 * @returns Array of trending topics
 */
export function getTrendingTopics(): TrendingTopic[] {
  return exploreData.trendingTopics
}

/**
 * Get suggested users
 * @returns Array of suggested users
 */
export function getSuggestedUsers(): SuggestedUser[] {
  return exploreData.suggestedUsers
}

// Export data for backward compatibility
export const trendingTopics: TrendingTopic[] = exploreData.trendingTopics
export const suggestedUsers: SuggestedUser[] = exploreData.suggestedUsers
