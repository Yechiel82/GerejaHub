import { getPublicContent } from "@/lib/data/content";
import { ContactForm } from "@/app/components/contact-form";
import { ErrorBoundary } from "@/app/components/error-boundary";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with us. We'd love to hear from you."
};

export const revalidate = 60;

export default async function ContactPage() {
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
          <p className="eyebrow">Get In Touch</p>
          <h1>Contact Us</h1>
          <p className="hero-copy">
            We'd love to hear from you. Whether you have questions, prayer requests, or just want to say hello.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="content-wrapper">
          <div className="contact-page-grid">
            <div className="contact-info">
              <h2>Reach Out</h2>
              <p>Use the form to send us a message, or reach out directly using the information below.</p>
              
              <div className="contact-details">
                <div className="contact-detail-item">
                  <h3>Email</h3>
                  <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
                </div>

                <div className="contact-detail-item">
                  <h3>Phone</h3>
                  <p><a href={`tel:${settings.phone}`}>{settings.phone}</a></p>
                </div>

                <div className="contact-detail-item">
                  <h3>Address</h3>
                  <p>{settings.address}</p>
                </div>

                <div className="contact-detail-item">
                  <h3>Service Times</h3>
                  <p>{settings.service_time}</p>
                </div>
              </div>

              <div className="contact-note">
                <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
                <p>We typically respond within 24-48 hours.</p>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <ErrorBoundary>
                <ContactForm />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>

      <Footer email={settings.email} phone={settings.phone} address={settings.address} />
    </main>
  );
}

// Made with Bob
