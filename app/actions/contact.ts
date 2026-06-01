'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { validateContactForm, sanitizeInput } from '@/lib/utils/validation'
import { createErrorResult, createSuccessResult, RateLimitError, ValidationError, type ActionResult } from '@/lib/utils/errors'
import { SUCCESS_MESSAGES } from '@/lib/utils/constants'
import { checkRateLimit } from '@/lib/utils/rate-limit'

export async function submitContactMessage(formData: FormData): Promise<ActionResult<string>> {
  try {
    // Rate limiting
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    
    const rateLimitResult = checkRateLimit(`contact:${ip}`)
    if (!rateLimitResult.allowed) {
      throw new RateLimitError()
    }

    // Validation
    const validation = validateContactForm(formData)
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0]
      throw new ValidationError(errorMessage)
    }

    // Sanitize inputs
    const name = sanitizeInput(formData.get('name')?.toString() || '')
    const email = sanitizeInput(formData.get('email')?.toString() || '')
    const message = sanitizeInput(formData.get('message')?.toString() || '')

    // Insert to database
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        message,
        status: 'new'
      } as any)

    if (error) {
      throw new Error('Failed to submit message')
    }

    revalidatePath('/')
    return createSuccessResult(SUCCESS_MESSAGES.CONTACT_SUBMITTED)
  } catch (error) {
    return createErrorResult(error)
  }
}
