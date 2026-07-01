import { MemberShell } from '@/app/member/member-shell'
import { requireMemberUser } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDisplayDate } from '@/lib/data/content'
import { NoteEditor } from './note-editor'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SermonNotesPage({ params }: PageProps) {
  const { user, profile } = await requireMemberUser()
  const supabase = await createSupabaseServerClient()
  const { id } = await params

  // Get sermon details
  const { data: sermon } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (!sermon) {
    notFound()
  }

  // Get user's notes for this sermon
  const { data: existingNote } = await supabase
    .from('sermon_notes')
    .select('*')
    .eq('sermon_id', id)
    .eq('user_id', user.id)
    .single()

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Sermon Notes</p>
        <h1>{(sermon as any).title}</h1>
        <p className="sermon-meta-info">
          {(sermon as any).speaker} • {formatDisplayDate((sermon as any).sermon_date)}
          {(sermon as any).scripture_reference && (
            <span> • 📖 {(sermon as any).scripture_reference}</span>
          )}
        </p>
      </div>

      <div className="notes-container">
        <div className="notes-sidebar">
          <div className="sermon-info-card">
            <h3>Sermon Details</h3>
            {(sermon as any).description && (
              <p>{(sermon as any).description}</p>
            )}
            {((sermon as any).video_url || (sermon as any).audio_url) && (
              <a
                href={(sermon as any).video_url || (sermon as any).audio_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
              >
                ▶ {(sermon as any).video_url ? 'Watch Sermon' : 'Listen to Sermon'}
              </a>
            )}
          </div>

          <div className="notes-tips">
            <h4>💡 Note-Taking Tips</h4>
            <ul>
              <li>Write down key points and scriptures</li>
              <li>Note questions that arise</li>
              <li>Record personal applications</li>
              <li>Your notes auto-save as you type</li>
            </ul>
          </div>
        </div>

        <div className="notes-editor-container">
          <NoteEditor
            sermonId={id}
            initialContent={(existingNote as any)?.content || ''}
            noteId={existingNote?.id}
          />
        </div>
      </div>
    </MemberShell>
  )
}

// Made with Bob
