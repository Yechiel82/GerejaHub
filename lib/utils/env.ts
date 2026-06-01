import { logError } from './errors'

export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_EMAILS'
  ]

  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
    logError(error, { missing })
    
    if (process.env.NODE_ENV === 'production') {
      throw error
    } else {
      console.warn('⚠️  Warning:', error.message)
    }
  }
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]
  
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  
  return value || defaultValue || ''
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Made with Bob
