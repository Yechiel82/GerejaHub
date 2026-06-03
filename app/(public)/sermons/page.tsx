import { formatDisplayDate, getPublicContent } from "@/lib/data/content";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Sermons",
  description: "Listen to our latest sermons and messages."
};

export const revalidate = 60;

export default async function SermonsPage() {
  const { sermons } = await getPublicContent();

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
          <p className="eyebrow">Latest Messages</p>
          <h1>Sermons</h1>
          <p className="hero-copy">
            Explore our sermon archive. Watch or listen to messages that inspire, challenge, and encourage spiritual growth.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrapper">
          <div className="sermon-grid">
            {sermons.map((sermon) => (
              <article className="card" key={sermon.id}>
                <span>{formatDisplayDate(sermon.sermon_date)}</span>
                <h3>{sermon.title}</h3>
                <p>{sermon.speaker}</p>
                {sermon.scripture_reference && (
                  <p className="scripture-ref">{sermon.scripture_reference}</p>
                )}
                {sermon.description && (
                  <p className="sermon-description">{sermon.description}</p>
                )}
                <div className="sermon-actions">
                  {sermon.video_url && (
                    <a href={sermon.video_url} target="_blank" rel="noopener noreferrer" className="button primary">
                      Watch
                    </a>
                  )}
                  {sermon.audio_url && (
                    <a href={sermon.audio_url} target="_blank" rel="noopener noreferrer" className="button secondary">
                      Listen
                    </a>
                  )}
                  {!sermon.video_url && !sermon.audio_url && (
                    <Link href="/contact" className="button secondary">
                      Request Access
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          {sermons.length === 0 && (
            <div className="empty-state">
              <p>No sermons available yet. Check back soon!</p>
            </div>
          )}

          <div className="cta-section">
            <h2>Want to Access Our Full Archive?</h2>
            <p>Members have access to our complete sermon library with notes and discussion guides.</p>
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
