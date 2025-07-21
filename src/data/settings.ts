/**
 * Settings page data and types
 */

import settingsData from "./settings.json"

// Setting item type definitions
export interface SettingItem {
  id: string
  label: string
  type: "button" | "switch"
  action?: string
  defaultValue?: boolean
}

export interface SettingSection {
  id: string
  title: string
  icon: string
  items: SettingItem[]
  variant?: "default" | "danger"
}

/**
 * Get settings sections
 * @returns All settings sections
 */
export function getSettingsSections(): SettingSection[] {
  return settingsData.sections as SettingSection[]
}

/**
 * Get a specific settings section by ID
 * @param sectionId - The section ID to find
 * @returns The settings section or undefined if not found
 */
export function getSettingsSectionById(
  sectionId: string,
): SettingSection | undefined {
  const sections = getSettingsSections()
  return sections.find((section) => section.id === sectionId)
}

/**
 * Get notification settings
 * @returns Notification settings items
 */
export function getNotificationSettings(): SettingItem[] {
  const notificationSection = getSettingsSectionById("notifications")
  return notificationSection?.items || []
}

/**
 * Get app settings
 * @returns App settings items
 */
export function getAppSettings(): SettingItem[] {
  const appSection = getSettingsSectionById("app")
  return appSection?.items || []
}
