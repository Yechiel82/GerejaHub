import Link from "next/link";
import { MemberShell } from "./member-shell";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDisplayDate } from "@/lib/data/content";
import "./dashboard.css";

function getEventDateParts(date: string) {
  const parsed = new Date(date);

  return {
    month: parsed.toLocaleDateString("en-US", { month: "short" }),
    day: parsed.toLocaleDateString("en-US", { day: "numeric" })
  };
}

export default async function MemberPage() {
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();

  // Fetch user's data
  const [
    { data: prayerRequests },
    { data: upcomingEvents },
    { data: userMinistries },
    { data: latestSermon }
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
      .single()
  ]);

  const events = (upcomingEvents as any)?.map((rsvp: any) => rsvp.events) || [];
  const ministries = (userMinistries as any)?.map((m: any) => m.ministries) || [];
  const sermon = latestSermon as any;
  const prayerItems = (prayerRequests as any[]) || [];
  const firstName = profile.full_name?.split(" ")[0] || "there";
  const nextEvent = events[0];

  return (
    <MemberShell profile={profile}>
      <div className="member-dashboard">
        <section className="member-hero">
          <div className="member-hero-copy">
            <h1>Welcome back, {firstName}</h1>
            <p>Your church week at a glance, with the next steps that matter most.</p>
          </div>
          <div className="member-hero-actions">
            <Link href="/member/prayer" className="member-action-button primary-action">
              <span aria-hidden="true">+</span>
              Submit Prayer
            </Link>
            <Link href="/member/events" className="member-action-button secondary-action">
              Browse Events
            </Link>
          </div>
        </section>

        <section className="member-notice-panel" aria-label="Member updates">
          <div className="member-notice-icon" aria-hidden="true">
            {nextEvent ? getEventDateParts(nextEvent.event_date).day : "!"}
          </div>
          <div className="member-notice-copy">
            <span>{nextEvent ? "Upcoming event" : "No upcoming event"}</span>
            {nextEvent ? (
              <>
                <h2>{nextEvent.title}</h2>
                <p>
                  {formatDisplayDate(nextEvent.event_date)}
                  {nextEvent.location ? ` at ${nextEvent.location}` : ""}
                </p>
              </>
            ) : (
              <>
                <h2>Your calendar is clear</h2>
                <p>Browse church events and RSVP when something fits your week.</p>
              </>
            )}
          </div>
          <Link href="/member/events" className="member-notice-link">
            {nextEvent ? "View event" : "Find events"}
          </Link>
        </section>

        <div className="member-content-grid">
          <div className="member-primary-column">
            <section className="member-dashboard-panel">
              <div className="member-panel-heading">
                <div>
                  <h2>Upcoming Events</h2>
                  <p>Events you&apos;re attending next.</p>
                </div>
                <Link href="/member/events">View all</Link>
              </div>
              <div className="member-list">
                {events.length ? (
                  events.map((event: any) => (
                    <article key={event.id} className="member-list-item">
                      <div className="member-date-box">
                        <span>{getEventDateParts(event.event_date).month}</span>
                        <strong>{getEventDateParts(event.event_date).day}</strong>
                      </div>
                      <div>
                        <h3>{event.title}</h3>
                        <p>{formatDisplayDate(event.event_date)}</p>
                        {event.location && <p>{event.location}</p>}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="member-empty-state">
                    <h3>No events on your calendar</h3>
                    <p>Browse upcoming church events and RSVP when something fits your week.</p>
                    <Link href="/member/events">Find events</Link>
                  </div>
                )}
              </div>
            </section>

            <section className="member-dashboard-panel">
              <div className="member-panel-heading">
                <div>
                  <h2>Recent Prayer Requests</h2>
                  <p>Your latest shared requests.</p>
                </div>
                <Link href="/member/prayer">View all</Link>
              </div>
              <div className="member-prayer-list">
                {prayerItems.length ? (
                  prayerItems.map((item: any) => (
                    <article key={item.id} className="member-prayer-item">
                      <div>
                        <h3>{item.title}</h3>
                        {item.description && <p>{item.description}</p>}
                      </div>
                      <div className="member-prayer-meta">
                        <span className={`status-badge status-${item.status}`}>{item.status}</span>
                        <span>{formatDisplayDate(item.created_at)}</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="member-empty-state">
                    <h3>No prayer requests yet</h3>
                    <p>Start a request when you want the church to pray with you.</p>
                    <Link href="/member/prayer">Submit your first request</Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="member-secondary-column">
            <section className="member-dashboard-panel sermon-panel">
              <div className="member-panel-heading">
                <div>
                  <h2>Latest Sermon</h2>
                  <p>Most recent message.</p>
                </div>
                <Link href="/member/sermons">Library</Link>
              </div>
              {sermon ? (
                <article className="member-sermon-card">
                  <h3>{sermon.title}</h3>
                  <p className="sermon-meta">
                    {sermon.speaker} • {formatDisplayDate(sermon.sermon_date)}
                  </p>
                  {sermon.scripture_reference && (
                    <p className="sermon-scripture">{sermon.scripture_reference}</p>
                  )}
                  {sermon.description && <p>{sermon.description}</p>}
                  <div className="sermon-actions">
                    {(sermon.video_url || sermon.audio_url) && (
                      <a
                        href={sermon.video_url || sermon.audio_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="member-action-button primary-action"
                      >
                        {sermon.video_url ? "Watch Now" : "Listen Now"}
                      </a>
                    )}
                    <Link href="/member/sermons" className="member-action-button secondary-action">
                      Browse Sermons
                    </Link>
                  </div>
                </article>
              ) : (
                <div className="member-empty-state">
                  <h3>No sermon available</h3>
                  <p>Check the sermon library for published messages.</p>
                  <Link href="/member/sermons">Open library</Link>
                </div>
              )}
            </section>

            <section className="member-dashboard-panel">
              <div className="member-panel-heading">
                <div>
                  <h2>My Ministries</h2>
                  <p>Places you&apos;re serving.</p>
                </div>
                <Link href="/member/ministries">Explore</Link>
              </div>
              <div className="member-ministry-list">
                {ministries.length ? (
                  ministries.map((ministry: any) => (
                    <article key={ministry.id} className="member-ministry-item">
                      <h3>{ministry.name}</h3>
                      {ministry.meeting_day && ministry.meeting_time ? (
                        <p>{ministry.meeting_day} at {ministry.meeting_time}</p>
                      ) : (
                        <p>Meeting schedule to be announced.</p>
                      )}
                    </article>
                  ))
                ) : (
                  <div className="member-empty-state">
                    <h3>No ministries joined yet</h3>
                    <p>Find a ministry where your gifts can serve the church.</p>
                    <Link href="/member/ministries">Browse ministries</Link>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </MemberShell>
  );
}

// Made with Bob
