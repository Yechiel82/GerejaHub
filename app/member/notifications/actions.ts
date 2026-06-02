'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createErrorResult, createSuccessResult, type ActionResult } from '@/lib/utils/errors'

export async function markAsRead(notificationId: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('notifications')
      // @ts-ignore - Supabase type inference issue
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to mark as read: ${error.message}`)
    }

    revalidatePath('/member/notifications')
    revalidatePath('/member')
    
    return createSuccessResult('Marked as read')
  } catch (error) {
    return createErrorResult(error)
  }
}

export async function deleteNotification(notificationId: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`)
    }

    revalidatePath('/member/notifications')
    revalidatePath('/member')
    
    return createSuccessResult('Notification deleted')
  } catch (error) {
    return createErrorResult(error)
  }
}

export async function markAllAsRead(): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('notifications')
      // @ts-ignore - Supabase type inference issue
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    if (error) {
      throw new Error(`Failed to mark all as read: ${error.message}`)
    }

    revalidatePath('/member/notifications')
    revalidatePath('/member')
    
    return createSuccessResult('All notifications marked as read')
  } catch (error) {
    return createErrorResult(error)
  }
}

// Made with Bob