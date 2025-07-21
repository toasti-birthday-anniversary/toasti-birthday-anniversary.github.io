/**
 * Profile page data and types
 */

import profileData from "./profile.json"

// User profile type definitions
export interface UserProfile {
  id?: string
  name: string
  username: string
  bio: string
  location: string
  joinDate: string
  following: number
  followers: number
  tweets: number
  verified?: boolean
  website?: string
  birthDate?: string
}

export interface ProfileTab {
  id: string
  label: string
  count?: number
  icon?: string
}

/**
 * Get current user profile
 * @returns Current user profile data
 */
export function getCurrentUserProfile(): UserProfile {
  return profileData.currentUser as UserProfile
}

/**
 * Get profile tabs with dynamic counts
 * @param profile - User profile data
 * @returns Array of profile tabs
 */
export function getProfileTabs(profile: UserProfile): ProfileTab[] {
  return (profileData.tabs as ProfileTab[]).map((tab: ProfileTab) => ({
    ...tab,
    count: tab.id === "tweets" ? profile.tweets : tab.count,
  }))
}

/**
 * Calculate profile completion percentage
 * @param profile - User profile data
 * @returns Completion percentage (0-100)
 */
export function getProfileCompletionPercentage(profile: UserProfile): number {
  const fields = ["name", "bio", "location", "website", "birthDate"]
  const filledFields = fields.filter(
    (field) => profile[field as keyof UserProfile],
  )
  return Math.round((filledFields.length / fields.length) * 100)
}

/**
 * Get profile statistics
 * @param profile - User profile data
 * @returns Profile statistics object
 */
export function getProfileStats(profile: UserProfile) {
  return {
    tweets: profile.tweets,
    following: profile.following,
    followers: profile.followers,
    engagement:
      Math.round((profile.tweets / Math.max(profile.followers, 1)) * 100) / 100,
  }
}
