import { MAX_EMAIL_LENGTH, MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, MIN_MESSAGE_LENGTH } from './constants'

export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= MAX_EMAIL_LENGTH
}

export function validateContactForm(data: FormData): ValidationResult {
  const errors: Record<string, string> = {}
  
  const name = data.get('name')?.toString().trim() || ''
  const email = data.get('email')?.toString().trim() || ''
  const message = data.get('message')?.toString().trim() || ''

  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be less than ${MAX_NAME_LENGTH} characters`
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!message) {
    errors.message = 'Message is required'
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, MAX_MESSAGE_LENGTH)
}

export function validatePrayerRequest(data: FormData): ValidationResult {
  const errors: Record<string, string> = {}
  
  const name = data.get('name')?.toString().trim() || ''
  const request = data.get('request')?.toString().trim() || ''
  const visibility = data.get('visibility')?.toString() || ''

  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be less than ${MAX_NAME_LENGTH} characters`
  }

  if (!request) {
    errors.request = 'Prayer request is required'
  } else if (request.length < MIN_MESSAGE_LENGTH) {
    errors.request = `Request must be at least ${MIN_MESSAGE_LENGTH} characters`
  } else if (request.length > MAX_MESSAGE_LENGTH) {
    errors.request = `Request must be less than ${MAX_MESSAGE_LENGTH} characters`
  }

  if (!visibility || !['private', 'church'].includes(visibility)) {
    errors.visibility = 'Please select a visibility option'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Made with Bob
