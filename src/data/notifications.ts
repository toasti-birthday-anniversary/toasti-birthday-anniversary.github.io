import notificationsData from "./notifications.json"

export interface NotificationUser {
  name: string
  username: string
  avatar?: string
}

export interface Notification {
  id: string
  type: "birthday" | "like" | "follow" | "retweet" | "reply" | "mention"
  user: NotificationUser
  content?: string
  timestamp: string
  isRead: boolean
}

/**
 * Get all notifications
 * @returns Array of all notifications
 */
export function getNotifications(): Notification[] {
  return notificationsData.notifications as Notification[]
}

/**
 * Get unread notifications count
 * @returns Number of unread notifications
 */
export function getUnreadNotificationsCount(): number {
  return (notificationsData.notifications as Notification[]).filter(
    (notification: Notification) => !notification.isRead,
  ).length
}

// Export data for backward compatibility
export const sampleNotifications: Notification[] =
  notificationsData.notifications as Notification[]
