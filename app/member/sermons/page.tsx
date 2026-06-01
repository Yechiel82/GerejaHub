import { MemberShell } from '../member-shell'
import { requireMemberUser } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SermonCard } from './sermon-card'
import { formatDisplayDate } from '@/lib/data/content'

export default async function MemberSermonsPage() {
  const { user, profile } = await requireMemberUser()
  const supabase = await createSupabaseServerClient()

  // Get all published sermons with user's bookmarks
  const { data: sermons } = await supabase
    .from('sermons')
    .select(`
      *,
      sermon_bookmarks!left(id)
    `)
    .eq('published', true)
    .order('sermon_date', { ascending: false })

  // Transform data to include bookmark status
  const sermonsWithBookmark = sermons?.map(sermon => ({
    ...sermon,
    isBookmarked: sermon.sermon_bookmarks && sermon.sermon_bookmarks.length > 0
  })) || []

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Sermons</p>
        <h1>Sermon Library</h1>
        <p>Browse all sermons, bookmark your favorites, and take personal notes.</p>
      </div>

      <div className="admin-panel">
        <div className="sermon-list">
          {sermonsWithBookmark.length > 0 ? (
            sermonsWithBookmark.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                isBookmarked={sermon.isBookmarked}
              />
            ))
          ) : (
            <p>No sermons available yet.</p>
          )}
        </div>
      </div>
    </MemberShell>
  )
}

// Made with Bob
