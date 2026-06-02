'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createErrorResult, createSuccessResult, type ActionResult } from '@/lib/utils/errors'

export async function saveNote(
  sermonId: string,
  content: string,
  noteId?: string
): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    if (noteId) {
      // Update existing note
      const { error } = await supabase
        .from('sermon_notes')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', noteId)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to update note: ${error.message}`)
      }
    } else {
      // Create new note
      const { error } = await supabase
        .from('sermon_notes')
        .insert({
          sermon_id: sermonId,
          user_id: user.id,
          content
        } as any)

      if (error) {
        throw new Error(`Failed to create note: ${error.message}`)
      }
    }

    revalidatePath(`/member/sermons/${sermonId}/notes`)
    
    return createSuccessResult('Note saved')
  } catch (error) {
    return createErrorResult(error)
  }
}

export async function deleteNote(noteId: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('sermon_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`)
    }

    revalidatePath('/member/sermons')
    
    return createSuccessResult('Note deleted')
  } catch (error) {
    return createErrorResult(error)
  }
}

// Made with Bob