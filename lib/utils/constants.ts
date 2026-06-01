// App Constants
export const APP_NAME = 'GerejaHub'
export const APP_DESCRIPTION = 'An open-source church website and PWA starter.'

// Navigation
export const NAV_ITEMS = ['Visit', 'Sermons', 'Events', 'Ministries', 'Contact'] as const

// Revalidation
export const CONTENT_REVALIDATE_SECONDS = 60

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 5

// Form Validation
export const MAX_NAME_LENGTH = 100
export const MAX_EMAIL_LENGTH = 255
export const MAX_MESSAGE_LENGTH = 2000
export const MIN_MESSAGE_LENGTH = 10

// Date Formatting
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
}

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  SERVER: 'Server error. Please try again later.'
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CONTACT_SUBMITTED: 'Thank you! Your message has been sent successfully.',
  PRAYER_SUBMITTED: 'Your prayer request has been submitted.',
  PROFILE_UPDATED: 'Your profile has been updated.',
  SETTINGS_UPDATED: 'Settings have been updated.'
} as const

// Made with Bob
