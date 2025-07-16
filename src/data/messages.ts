/**
 * Messages page data and types
 */

import messagesData from "./messages.json"

// Message conversation type definitions
export interface MessageUser {
  name: string
  username: string
}

export interface MessageConversation {
  id: string
  user: MessageUser
  lastMessage: string
  timestamp: string
  unread: boolean
}

/**
 * Get all conversations
 * @returns All message conversations
 */
export function getConversations(): MessageConversation[] {
  return messagesData.conversations
}

/**
 * Get unread conversations count
 * @returns Number of unread conversations
 */
export function getUnreadCount(): number {
  return messagesData.conversations.filter(
    (conversation: MessageConversation) => conversation.unread,
  ).length
}

/**
 * Get a conversation by ID
 * @param conversationId - The conversation ID to find
 * @returns The conversation or undefined if not found
 */
export function getConversationById(
  conversationId: string,
): MessageConversation | undefined {
  return messagesData.conversations.find(
    (conversation: MessageConversation) => conversation.id === conversationId,
  )
}

/**
 * Get recent conversations (last 5)
 * @returns Recent conversations
 */
export function getRecentConversations(): MessageConversation[] {
  return messagesData.conversations.slice(0, 5)
}
