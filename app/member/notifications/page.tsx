import { MemberShell } from '../member-shell'
import { requireMemberUser } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NotificationItem } from './notification-item'
import { NotificationFilter } from './notification-filter'

interface PageProps {
  searchParams: { type?: string }
}

export default async function MemberNotificationsPage({ searchParams }: PageProps) {
  const { user, profile } = await requireMemberUser()
  const supabase = await createSupabaseServerClient()

  // Build query
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Filter by type if specified
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('type', searchParams.type)
  }

  const { data: notifications } = await query

  // Get counts by type
  const { data: counts } = await supabase
    .from('notifications')
    .select('type')
    .eq('user_id', user.id)

  const typeCounts = {
    all: counts?.length || 0,
    event: counts?.filter((n: any) => n.type === 'event').length || 0,
    prayer: counts?.filter((n: any) => n.type === 'prayer').length || 0,
    ministry: counts?.filter((n: any) => n.type === 'ministry').length || 0,
    sermon: counts?.filter((n: any) => n.type === 'sermon').length || 0,
    announcement: counts?.filter((n: any) => n.type === 'announcement').length || 0,
  }

  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Notifications</p>
        <h1>Stay Updated</h1>
        <p>
          {unreadCount > 0 ? (
            <span className="unread-badge">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
          ) : (
            'You\'re all caught up!'
          )}
        </p>
      </div>

      <NotificationFilter currentType={searchParams.type || 'all'} counts={typeCounts} />

      <section className="admin-panel">
        <div className="notifications-list">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="empty-state">
              <p>📭</p>
              <h3>No notifications yet</h3>
              <p>When you receive updates, they'll appear here.</p>
            </div>
          )}
        </div>
      </section>
    </MemberShell>
  )
}

// Made with Bob