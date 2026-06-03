"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Visit", href: "/visit" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Ministries", href: "/ministries" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="mobile-menu-button"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="mobile-menu-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/member/login"
            className="mobile-menu-login"
            onClick={closeMenu}
          >
            Member Login
          </Link>
        </nav>
      </div>
    </>
  );
}
