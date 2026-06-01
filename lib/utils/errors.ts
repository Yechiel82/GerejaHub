import { ERROR_MESSAGES } from './constants'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = ERROR_MESSAGES.RATE_LIMIT) {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, 'UNAUTHORIZED_ERROR', 401)
    this.name = 'UnauthorizedError'
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return ERROR_MESSAGES.GENERIC
}

export function logError(error: unknown, context?: Record<string, unknown>): void {
  // In production, this would send to error tracking service (Sentry, etc.)
  console.error('Error:', {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    context,
    timestamp: new Date().toISOString()
  })
}

export type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

export function createSuccessResult<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function createErrorResult(error: unknown): ActionResult<never> {
  const message = getErrorMessage(error)
  logError(error)
  return { success: false, error: message }
}

// Made with Bob
