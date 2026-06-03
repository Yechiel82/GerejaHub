import { getPublicContent } from "@/lib/data/content";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Ministries",
  description: "Explore ministry opportunities and find your place to serve."
};

export const revalidate = 60;

export default async function MinistriesPage() {
  const { ministries } = await getPublicContent();

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
          <p className="eyebrow">Get Connected</p>
          <h1>Ministries</h1>
          <p className="hero-copy">
            Discover meaningful ways to serve, grow, and connect with others. Find your place in our church community.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrapper">
          <div className="ministries-grid-page">
            {ministries.map((ministry) => (
              <article key={ministry.id} className="ministry-card-detailed">
                <h3>{ministry.name}</h3>
                {ministry.description && (
                  <p className="ministry-description">{ministry.description}</p>
                )}
                {(ministry.meeting_day || ministry.meeting_time) && (
                  <p className="ministry-schedule">
                    <strong>Meets:</strong> {ministry.meeting_day} {ministry.meeting_time}
                  </p>
                )}
                {ministry.meeting_location && (
                  <p className="ministry-location">
                    <strong>Location:</strong> {ministry.meeting_location}
                  </p>
                )}
                <Link href="/contact" className="button secondary">
                  Learn More
                </Link>
              </article>
            ))}
          </div>

          {ministries.length === 0 && (
            <div className="empty-state">
              <p>Ministry information coming soon!</p>
            </div>
          )}

          <div className="cta-section">
            <h2>Ready to Get Involved?</h2>
            <p>Members can join ministries, connect with leaders, and receive updates about opportunities to serve.</p>
            <div className="cta-buttons">
              <Link href="/member/login" className="button primary">
                Member Login
              </Link>
              <Link href="/contact" className="button secondary">
                Ask Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Made with Bob
