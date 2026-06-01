'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createErrorResult, createSuccessResult, type ActionResult } from '@/lib/utils/errors'

export async function toggleSermonBookmark(
  sermonId: string,
  shouldBookmark: boolean
): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    if (shouldBookmark) {
      // Add bookmark
      const { error } = await supabase
        .from('sermon_bookmarks')
        .insert({
          sermon_id: sermonId,
          user_id: user.id
        } as any)

      if (error) {
        throw new Error('Failed to bookmark sermon')
      }
    } else {
      // Remove bookmark
      const { error } = await supabase
        .from('sermon_bookmarks')
        .delete()
        .eq('sermon_id', sermonId)
        .eq('user_id', user.id)

      if (error) {
        throw new Error('Failed to remove bookmark')
      }
    }

    revalidatePath('/member/sermons')
    revalidatePath('/member')
    
    return createSuccessResult(shouldBookmark ? 'Sermon bookmarked successfully!' : 'Bookmark removed successfully!')
  } catch (error) {
    return createErrorResult(error)
  }
}

// Made with Bob
