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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Not authenticated')
    }

    console.log(`User ${user.id} attempting to ${shouldJoin ? 'join' : 'leave'} ministry ${ministryId}`)

    if (shouldJoin) {
      // Check if already a member
      const { data: existing } = await supabase
        .from('ministry_members')
        .select('id')
        .eq('ministry_id', ministryId)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        console.log('User is already a member')
        return createSuccessResult('You are already a member of this ministry!')
      }

      // Join ministry
      const { data, error } = await supabase
        .from('ministry_members')
        .insert({
          ministry_id: ministryId,
          user_id: user.id,
          role: 'member'
        } as any)
        .select()

      if (error) {
        console.error('Insert error:', error)
        throw new Error(`Failed to join ministry: ${error.message}`)
      }

      console.log('Successfully joined ministry:', data)
    } else {
      // Leave ministry
      const { data, error } = await supabase
        .from('ministry_members')
        .delete()
        .eq('ministry_id', ministryId)
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error('Delete error:', error)
        throw new Error(`Failed to leave ministry: ${error.message}`)
      }

      if (!data || data.length === 0) {
        console.log('No membership found to delete')
        return createSuccessResult('You are not a member of this ministry.')
      }

      console.log('Successfully left ministry:', data)
    }

    revalidatePath('/member/ministries')
    revalidatePath('/member')
    
    return createSuccessResult(shouldJoin ? 'Successfully joined ministry!' : 'Successfully left ministry!')
  } catch (error) {
    console.error('Action error:', error)
    return createErrorResult(error)
  }
}

// Made with Bob
