import { submitContactMessage } from "./actions/contact";
import { formatDisplayDate, getPublicContent } from "@/lib/data/content";

const heroPoster = "/media/hero-poster.jpg";

export const revalidate = 60;

const navItems = ["Visit", "Sermons", "Events", "Ministries", "Contact"];

export default async function Home() {
  const { settings, sermons, events, ministries } = await getPublicContent();

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="GerejaHub home">
          <span className="brand-mark">GH</span>
          <span>GerejaHub</span>
        </a>
        <nav aria-label="Primary navigation">
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <a className="nav-login" href="/member/login">
              Member Login
            </a>
          </div>
        </nav>
      </header>

      <section id="top" className="hero">
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
            <a className="button primary" href="#visit">
              Rencanakan Kunjungan
            </a>
            <a className="button secondary" href="#sermons">
              Lihat Renungan
            </a>
          </div>
        </div>
      </section>

      <section id="visit" className="section visit-section">
        <div>
          <p className="section-kicker">For new visitors</p>
          <h2>Join us this Sunday</h2>
          <p>
            Make the first visit simple with worship times, address, parking notes, children&apos;s
            ministry information, and a clear sense of what to expect.
          </p>
        </div>
        <div className="visit-panel">
          <div>
            <span>Service Time</span>
            <strong>{settings.service_time}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{settings.address}</strong>
          </div>
          <div>
            <span>Contact</span>
            <strong>{settings.email}</strong>
          </div>
        </div>
      </section>

      <section id="sermons" className="section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Latest messages</p>
            <h2>Sermons</h2>
          </div>
          <a className="text-link" href="#contact">
            Request archive access
          </a>
        </div>
        <div className="sermon-grid">
          {sermons.map((sermon) => (
            <article className="card" key={sermon.id}>
              <span>{formatDisplayDate(sermon.sermon_date)}</span>
              <h3>{sermon.title}</h3>
              <p>{sermon.speaker}</p>
              <a href={sermon.media_url ?? "#contact"}>Listen now</a>
            </article>
          ))}
        </div>
      </section>

      <section id="events" className="section split-section">
        <div>
          <p className="section-kicker">Community rhythm</p>
          <h2>Events</h2>
          <p>
            Keep worship services, small groups, youth gatherings, classes, and special events easy to
            discover from any device.
          </p>
        </div>
        <div className="event-list">
          {events.map((event) => (
            <article key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.time_label}</p>
              <span>{event.location}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="ministries" className="section ministries-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Get connected</p>
            <h2>Ministries</h2>
          </div>
          <p>Simple paths for people to find their place in the church community.</p>
        </div>
        <div className="ministry-grid">
          {ministries.map((ministry) => (
            <a key={ministry.id} href="#contact">
              {ministry.name}
            </a>
          ))}
        </div>
      </section>

      <section className="section giving-section">
        <div>
          <p className="section-kicker">Generosity</p>
          <h2>Giving</h2>
          <p>{settings.giving_note}</p>
        </div>
        <a className="button primary" href="#contact">
          Giving Setup
        </a>
      </section>

      <section id="contact" className="section contact-section">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>We would love to hear from you</h2>
          <p>
            Use this section for general questions, visit planning, pastoral care, or prayer request
            intake.
          </p>
        </div>
        <form action={submitContactMessage}>
          <label>
            Name
            <input name="name" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="How can we help?" rows={5} required />
          </label>
          <button className="button primary" type="submit">
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
