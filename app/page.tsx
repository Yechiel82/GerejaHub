import { getPublicContent } from "@/lib/data/content";
import { MobileNav } from "./components/mobile-nav";
import { PwaInstall } from "./components/pwa-install";
import { Footer } from "./components/footer";
import Link from "next/link";

const heroPoster = "/media/hero-poster.jpg";

export const revalidate = 60;

export default async function Home() {
  const { settings } = await getPublicContent();

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="GerejaHub home">
          <img src="/media/logo.png" alt="GerejaHub" className="brand-logo" />
        </Link>
        
        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <MobileNav />
      </header>

      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          aria-label="Harvest field video background"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">{settings.hero_eyebrow}</p>
          <h1>{settings.hero_title}</h1>
          <p className="hero-copy">{settings.hero_description}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/visit">
              Plan Your Visit
            </Link>
            <Link className="button secondary" href="/sermons">
              Watch Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Cards Section */}
      <section className="section summary-section">
        <div className="content-wrapper">
          <div className="summary-intro">
            <h2>Welcome to Our Church</h2>
            <p>Discover what makes our community special and find your place to connect, grow, and serve.</p>
          </div>

          <div className="summary-grid">
            <article className="summary-card">
              <div className="summary-icon">📍</div>
              <h3>Visit Us</h3>
              <p>
                Plan your first visit with service times, location details, and what to expect. 
                We can't wait to welcome you!
              </p>
              <Link href="/visit" className="button secondary">
                Learn More →
              </Link>
            </article>

            <article className="summary-card">
              <div className="summary-icon">🎥</div>
              <h3>Sermons</h3>
              <p>
                Watch or listen to inspiring messages from our sermon archive. 
                Grow in faith through biblical teaching.
              </p>
              <Link href="/sermons" className="button secondary">
                Browse Sermons →
              </Link>
            </article>

            <article className="summary-card">
              <div className="summary-icon">📅</div>
              <h3>Events</h3>
              <p>
                Stay connected with upcoming church events, small groups, and special gatherings. 
                There's always something happening!
              </p>
              <Link href="/events" className="button secondary">
                View Events →
              </Link>
            </article>

            <article className="summary-card">
              <div className="summary-icon">🤝</div>
              <h3>Ministries</h3>
              <p>
                Discover meaningful ways to serve and connect. Find your place in our church community 
                through various ministry opportunities.
              </p>
              <Link href="/ministries" className="button secondary">
                Explore Ministries →
              </Link>
            </article>

            <article className="summary-card">
              <div className="summary-icon">💬</div>
              <h3>Contact</h3>
              <p>
                Have questions or need prayer? We're here for you. Reach out and let us know 
                how we can help.
              </p>
              <Link href="/contact" className="button secondary">
                Get In Touch →
              </Link>
            </article>

            <article className="summary-card highlight">
              <div className="summary-icon">👥</div>
              <h3>Member Area</h3>
              <p>
                Already a member? Access exclusive features like prayer requests, sermon notes, 
                event RSVPs, and more.
              </p>
              <Link href="/member/login" className="button primary">
                Member Login →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="section quick-info-section">
        <div className="content-wrapper">
          <div className="quick-info-grid">
            <div className="quick-info-item">
              <h3>Service Times</h3>
              <p>{settings.service_time}</p>
            </div>
            <div className="quick-info-item">
              <h3>Location</h3>
              <p>{settings.address}</p>
            </div>
            <div className="quick-info-item">
              <h3>Contact</h3>
              <p>{settings.email}</p>
              <p>{settings.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Installation Section */}
      <PwaInstall />

      {/* Footer */}
      <Footer email={settings.email} phone={settings.phone} address={settings.address} />
    </main>
  );
}
