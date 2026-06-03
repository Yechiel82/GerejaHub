import { getPublicContent } from "@/lib/data/content";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Events",
  description: "Discover upcoming church events and activities."
};

export const revalidate = 60;

export default async function EventsPage() {
  const { events } = await getPublicContent();

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="GerejaHub home">
          <img src="/media/logo.png" alt="GerejaHub" className="brand-logo" />
        </Link>
        
        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/visit">Visit</Link>
            <Link href="/sermons">Sermons</Link>
            <Link href="/events">Events</Link>
            <Link href="/ministries">Ministries</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="nav-actions">
            <Link className="nav-login" href="/member/login">
              Member Login
            </Link>
          </div>
        </nav>
      </header>

      <section className="page-hero">
        <div className="page-hero-content">
          <p className="eyebrow">Community Rhythm</p>
          <h1>Upcoming Events</h1>
          <p className="hero-copy">
            Stay connected with our church community through worship services, small groups, special events, and more.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrapper">
          <div className="event-list-page">
            {events.map((event) => (
              <article key={event.id} className="event-card">
                <div className="event-card-header">
                  <h3>{event.title}</h3>
                  <span className="event-date">{event.time_label}</span>
                </div>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                <div className="event-card-footer">
                  <span className="event-location">📍 {event.location}</span>
                  {event.registration_required && (
                    <Link href="/member/login" className="button primary">
                      RSVP
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          {events.length === 0 && (
            <div className="empty-state">
              <p>No upcoming events at this time. Check back soon!</p>
            </div>
          )}

          <div className="cta-section">
            <h2>Never Miss an Event</h2>
            <p>Members receive notifications about upcoming events and can RSVP directly.</p>
            <Link href="/member/login" className="button primary">
              Member Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Made with Bob
