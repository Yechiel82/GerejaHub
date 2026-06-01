import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from './constants'

type RateLimitStore = Map<string, { count: number; resetTime: number }>

const store: RateLimitStore = new Map()

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = store.get(identifier)

  // Clean up expired entries periodically
  if (store.size > 10000) {
    for (const [key, value] of store.entries()) {
      if (value.resetTime < now) {
        store.delete(key)
      }
    }
  }

  if (!record || record.resetTime < now) {
    // Create new record or reset expired one
    const resetTime = now + RATE_LIMIT_WINDOW_MS
    store.set(identifier, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime
    }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    }
  }

  // Increment count
  record.count++
  store.set(identifier, record)

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - record.count,
    resetTime: record.resetTime
  }
}

export function getRateLimitIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return `rate-limit:${ip}`
}

// Made with Bob
