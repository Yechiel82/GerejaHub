'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createErrorResult, createSuccessResult, type ActionResult } from '@/lib/utils/errors'

export async function updateEventRsvp(
  eventId: string,
  status: 'going' | 'maybe' | 'not_going'
): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Upsert RSVP (insert or update if exists)
    const { error } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        status
      } as any, {
        onConflict: 'event_id,user_id'
      })

    if (error) {
      throw new Error('Failed to update RSVP')
    }

    revalidatePath('/member/events')
    revalidatePath('/member')
    
    return createSuccessResult('RSVP updated successfully!')
  } catch (error) {
    return createErrorResult(error)
  }
}

export async function deleteEventRsvp(eventId: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error('Failed to delete RSVP')
    }

    revalidatePath('/member/events')
    revalidatePath('/member')
    
    return createSuccessResult('RSVP removed successfully!')
  } catch (error) {
    return createErrorResult(error)
  }
}

// Made with Bob
