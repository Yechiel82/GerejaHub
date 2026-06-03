import Link from "next/link";

interface FooterProps {
  email?: string;
  phone?: string;
  address?: string;
}

export function Footer({ email = "", phone = "", address = "" }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="content-wrapper">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/media/logo.png" alt="GerejaHub" className="footer-logo" />
            <p className="footer-tagline">Building stronger communities through digital engagement</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/visit">Visit Us</Link></li>
              <li><Link href="/sermons">Sermons</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/ministries">Ministries</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Member Area</h4>
            <ul className="footer-links">
              <li><Link href="/member/login">Member Login</Link></li>
              <li><Link href="/admin/login">Admin Login</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="footer-contact">
              {email && <li>📧 {email}</li>}
              {phone && <li>📞 {phone}</li>}
              {address && <li>📍 {address}</li>}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GerejaHub. All rights reserved.</p>
          <p className="footer-credit">Made with ❤️ for churches worldwide</p>
        </div>
      </div>
    </footer>
  );
}

// Made with Bob
