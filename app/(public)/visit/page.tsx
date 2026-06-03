import { getPublicContent } from "@/lib/data/content";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Visit Us",
  description: "Plan your visit to our church. Service times, location, and what to expect."
};

export const revalidate = 60;

export default async function VisitPage() {
  const { settings } = await getPublicContent();

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
          <p className="eyebrow">Plan Your Visit</p>
          <h1>Join Us This Sunday</h1>
          <p className="hero-copy">
            We'd love to welcome you! Here's everything you need to know about visiting our church for the first time.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrapper">
          <div className="visit-info-grid">
            <div className="visit-info-card">
              <h2>Service Times</h2>
              <p className="large-text">{settings.service_time}</p>
              <p>Join us for worship, teaching, and fellowship. Services typically last 90 minutes.</p>
            </div>

            <div className="visit-info-card">
              <h2>Location</h2>
              <p className="large-text">{settings.address}</p>
              <p>Free parking is available. The main entrance is clearly marked.</p>
            </div>

            <div className="visit-info-card">
              <h2>What to Wear</h2>
              <p>Come as you are! We have people in everything from jeans to suits. Comfort is key.</p>
            </div>

            <div className="visit-info-card">
              <h2>Children & Youth</h2>
              <p>We offer age-appropriate programs for children and youth during services. Check-in is available 15 minutes before service.</p>
            </div>

            <div className="visit-info-card">
              <h2>What to Expect</h2>
              <ul>
                <li>Welcoming greeters at the door</li>
                <li>Contemporary worship music</li>
                <li>Biblical teaching and preaching</li>
                <li>Communion (optional participation)</li>
                <li>Coffee and fellowship after service</li>
              </ul>
            </div>

            <div className="visit-info-card">
              <h2>First-Time Visitor?</h2>
              <p>Stop by our Welcome Center after the service. We'd love to meet you, answer questions, and give you a small gift!</p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Have Questions?</h2>
            <p>We're here to help make your first visit comfortable and welcoming.</p>
            <Link href="/contact" className="button primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer email={settings.email} phone={settings.phone} address={settings.address} />
    </main>
  );
}

// Made with Bob
