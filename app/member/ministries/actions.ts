'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createErrorResult, createSuccessResult, type ActionResult } from '@/lib/utils/errors'

export async function toggleMinistryMembership(
  ministryId: string,
  shouldJoin: boolean
): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    if (shouldJoin) {
      // Join ministry
      const { error } = await supabase
        .from('ministry_members')
        .insert({
          ministry_id: ministryId,
          user_id: user.id,
          role: 'member'
        } as any)

      if (error) {
        throw new Error('Failed to join ministry')
      }
    } else {
      // Leave ministry
      const { error } = await supabase
        .from('ministry_members')
        .delete()
        .eq('ministry_id', ministryId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Delete error:', error)
        throw new Error(`Failed to leave ministry: ${error.message}`)
      }
    }

    revalidatePath('/member/ministries')
    revalidatePath('/member')
    
    return createSuccessResult(shouldJoin ? 'Successfully joined ministry!' : 'Successfully left ministry!')
  } catch (error) {
    return createErrorResult(error)
  }
}

// Made with Bob
