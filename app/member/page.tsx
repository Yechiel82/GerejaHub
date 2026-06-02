import Link from "next/link";
import { MemberShell } from "./member-shell";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDisplayDate } from "@/lib/data/content";
import "./dashboard.css";

export default async function MemberPage() {
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();

  // Fetch user's data
  const [
    { data: prayerRequests },
    { data: upcomingEvents },
    { data: userMinistries },
    { data: latestSermon },
    { data: unreadNotifications }
  ] = await Promise.all([
    // Prayer requests
    supabase
      .from("prayer_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    
    // Upcoming events user is attending
    supabase
      .from("event_rsvps")
      .select(`
        *,
        events:event_id (
          id,
          title,
          event_date,
          location
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "going")
      .gte("events.event_date", new Date().toISOString())
      .order("events.event_date", { ascending: true })
      .limit(3),
    
    // User's ministries
    supabase
      .from("ministry_members")
      .select(`
        *,
        ministries:ministry_id (
          id,
          name,
          meeting_day,
          meeting_time
        )
      `)
      .eq("user_id", user.id)
      .limit(3),
    
    // Latest sermon
    supabase
      .from("sermons")
      .select("*")
      .eq("published", true)
      .order("sermon_date", { ascending: false })
      .limit(1)
      .single(),
    
    // Unread notifications count
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false)
  ]);

  const events = (upcomingEvents as any)?.map((rsvp: any) => rsvp.events) || [];
  const ministries = (userMinistries as any)?.map((m: any) => m.ministries) || [];
  const notificationCount = (unreadNotifications as any)?.count || 0;

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Member Area</p>
        <h1>{profile.full_name ? `Welcome, ${profile.full_name}` : "Welcome"}</h1>
        <p>Your personalized church dashboard</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <article className="admin-stat">
          <span>Role</span>
          <strong>{profile.role}</strong>
        </article>
        <article className="admin-stat">
          <span>Upcoming Events</span>
          <strong>{events.length}</strong>
        </article>
        <article className="admin-stat">
          <span>My Ministries</span>
          <strong>{ministries.length}</strong>
        </article>
        <article className="admin-stat">
          <span>Notifications</span>
          <strong>{notificationCount}</strong>
        </article>
      </div>

      {/* Quick Actions */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Quick Actions</h2>
          <p>Common tasks and shortcuts</p>
        </div>
        <div className="quick-actions">
          <Link href="/member/prayer" className="quick-action-card">
            <span className="quick-action-icon">🙏</span>
            <strong>Submit Prayer</strong>
            <p>Share your prayer request</p>
          </Link>
          <Link href="/member/events" className="quick-action-card">
            <span className="quick-action-icon">📅</span>
            <strong>Browse Events</strong>
            <p>RSVP to upcoming events</p>
          </Link>
          <Link href="/member/sermons" className="quick-action-card">
            <span className="quick-action-icon">🎧</span>
            <strong>Watch Sermons</strong>
            <p>Access sermon library</p>
          </Link>
          <Link href="/member/ministries" className="quick-action-card">
            <span className="quick-action-icon">⛪</span>
            <strong>Join Ministry</strong>
            <p>Get involved in service</p>
          </Link>
          <Link href="/member/groups" className="quick-action-card">
            <span className="quick-action-icon">👥</span>
            <strong>Small Groups</strong>
            <p>Find your community</p>
          </Link>
          <Link href="/member/notifications" className="quick-action-card">
            <span className="quick-action-icon">🔔</span>
            <strong>Notifications</strong>
            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
            <p>View updates</p>
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Your Upcoming Events</h2>
            <p>Events you're attending</p>
            <Link href="/member/events">View all →</Link>
          </div>
          <div className="dashboard-grid">
            {events.map((event: any) => (
              <article key={event.id} className="dashboard-card">
                <h3>{event.title}</h3>
                <p className="dashboard-card-meta">
                  📅 {formatDisplayDate(event.event_date)}
                </p>
                {event.location && (
                  <p className="dashboard-card-meta">📍 {event.location}</p>
                )}
                <Link href="/member/events" className="button secondary small">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* My Ministries */}
      {ministries.length > 0 && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>My Ministries</h2>
            <p>Your active ministry involvement</p>
            <Link href="/member/ministries">View all →</Link>
          </div>
          <div className="dashboard-grid">
            {ministries.map((ministry: any) => (
              <article key={ministry.id} className="dashboard-card">
                <h3>{ministry.name}</h3>
                {ministry.meeting_day && ministry.meeting_time && (
                  <p className="dashboard-card-meta">
                    🕐 {ministry.meeting_day} at {ministry.meeting_time}
                  </p>
                )}
                <Link href="/member/ministries" className="button secondary small">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Latest Sermon */}
      {latestSermon && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Latest Sermon</h2>
            <p>Most recent message</p>
            <Link href="/member/sermons">View all →</Link>
          </div>
          <article className="sermon-featured">
            <div>
              <h3>{(latestSermon as any).title}</h3>
              <p className="sermon-meta">
                {(latestSermon as any).speaker} • {formatDisplayDate((latestSermon as any).sermon_date)}
              </p>
              {(latestSermon as any).scripture_reference && (
                <p className="sermon-scripture">📖 {(latestSermon as any).scripture_reference}</p>
              )}
              {(latestSermon as any).description && (
                <p>{(latestSermon as any).description}</p>
              )}
            </div>
            <div className="sermon-actions">
              {((latestSermon as any).video_url || (latestSermon as any).audio_url) && (
                <a
                  href={(latestSermon as any).video_url || (latestSermon as any).audio_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                >
                  ▶ {(latestSermon as any).video_url ? 'Watch' : 'Listen'} Now
                </a>
              )}
              <Link href="/member/sermons" className="button secondary">
                Browse All Sermons
              </Link>
            </div>
          </article>
        </section>
      )}

      {/* Recent Prayer Requests */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Recent Prayer Requests</h2>
          <p>Your latest submitted requests</p>
          <Link href="/member/prayer">View all →</Link>
        </div>
        <div className="admin-list">
          {prayerRequests?.length ? (
            prayerRequests.map((item: any) => (
              <article key={item.id}>
                <strong>{item.title}</strong>
                <span className={`status-badge status-${item.status}`}>
                  {item.status}
                </span>
                {item.description && <p>{item.description}</p>}
                <span className="item-meta">
                  {formatDisplayDate(item.created_at)}
                </span>
              </article>
            ))
          ) : (
            <p>No prayer requests yet. <Link href="/member/prayer">Submit your first request →</Link></p>
          )}
        </div>
      </section>
    </MemberShell>
  );
}

// Made with Bob
