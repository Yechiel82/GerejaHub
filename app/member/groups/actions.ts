'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createErrorResult, createSuccessResult, type ActionResult } from '@/lib/utils/errors'

export async function toggleGroupMembership(
  groupId: string,
  shouldJoin: boolean
): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Not authenticated')
    }

    console.log(`User ${user.id} attempting to ${shouldJoin ? 'join' : 'leave'} group ${groupId}`)

    if (shouldJoin) {
      // Check if group is full
      const { data: group } = await supabase
        .from('small_groups')
        .select('max_members, is_open')
        .eq('id', groupId)
        .single()

      if (!(group as any)?.is_open) {
        throw new Error('This group is not accepting new members')
      }

      const { count } = await supabase
        .from('small_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId)

      if (count && count >= (group as any).max_members) {
        throw new Error('This group is full')
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from('small_group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        console.log('User is already a member')
        return createSuccessResult('You are already a member of this group!')
      }

      // Join group
      const { data, error } = await supabase
        .from('small_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        } as any)
        .select()

      if (error) {
        console.error('Insert error:', error)
        throw new Error(`Failed to join group: ${error.message}`)
      }

      console.log('Successfully joined group:', data)
    } else {
      // Leave group
      const { data, error } = await supabase
        .from('small_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error('Delete error:', error)
        throw new Error(`Failed to leave group: ${error.message}`)
      }

      if (!data || data.length === 0) {
        console.log('No membership found to delete')
        return createSuccessResult('You are not a member of this group.')
      }

      console.log('Successfully left group:', data)
    }

    revalidatePath('/member/groups')
    revalidatePath('/member')
    
    return createSuccessResult(shouldJoin ? 'Successfully joined group!' : 'Successfully left group!')
  } catch (error) {
    console.error('Action error:', error)
    return createErrorResult(error)
  }
}

// Made with Bob