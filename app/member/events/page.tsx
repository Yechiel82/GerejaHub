import { MemberShell } from '../member-shell'
import { requireMemberUser } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EventRsvpButton } from './rsvp-button'
import { formatDisplayDate } from '@/lib/data/content'

export default async function MemberEventsPage() {
  const { user, profile } = await requireMemberUser()
  const supabase = await createSupabaseServerClient()

  // Get all published events with user's RSVP status
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      event_rsvps!left(status)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  // Transform data to include RSVP status
  const eventsWithRsvp = events?.map(event => ({
    ...event,
    userRsvpStatus: event.event_rsvps?.[0]?.status || null
  })) || []

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Events</p>
        <h1>Church Events</h1>
        <p>Browse upcoming events and RSVP to let us know you're coming.</p>
      </div>

      <div className="admin-panel">
        <div className="event-list">
          {eventsWithRsvp.length > 0 ? (
            eventsWithRsvp.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-card-content">
                  <h3>{event.title}</h3>
                  <p className="event-time">{event.time_label}</p>
                  <span className="event-location">{event.location}</span>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                  {event.event_date && (
                    <span className="event-date">
                      {formatDisplayDate(event.event_date)}
                    </span>
                  )}
                </div>
                <EventRsvpButton
                  eventId={event.id}
                  currentStatus={event.userRsvpStatus}
                />
              </article>
            ))
          ) : (
            <p>No events available at this time.</p>
          )}
        </div>
      </div>
    </MemberShell>
  )
}

// Made with Bob
