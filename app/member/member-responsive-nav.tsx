"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import type { Profile } from "@/lib/supabase/types";

const memberNav = [
  ["Home", "/member"],
  ["Events", "/member/events"],
  ["Sermons", "/member/sermons"],
  ["Ministries", "/member/ministries"],
  ["Prayer", "/member/prayer"],
  ["Profile", "/member/profile"]
];

function MemberNavigation({ profile, onNavigate }: { profile: Profile; onNavigate?: () => void }) {
  return (
    <>
      <Link className="admin-brand" href="/member" onClick={onNavigate}>
        <img src="/media/logo.png" alt="GerejaHub" className="sidebar-logo" />
        <span>GerejaHub Member</span>
      </Link>
      <nav className="admin-nav" aria-label="Member navigation">
        {memberNav.map(([label, href]) => (
          <Link key={href} href={href} onClick={onNavigate}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="admin-account">
        <span>{profile.email}</span>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </div>
    </>
  );
}

export function MemberResponsiveNav({ profile }: { profile: Profile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 981px)");
    const syncViewport = () => {
      setIsDesktop(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsOpen(false);
      }
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  if (isDesktop) {
    return (
      <aside className="admin-sidebar member-sidebar member-desktop-sidebar">
        <MemberNavigation profile={profile} />
      </aside>
    );
  }

  return (
    <div className={`member-mobile-menu ${isOpen ? "member-mobile-menu-open" : ""}`}>
      {pathname !== "/member" ? (
        <button
          className="member-mobile-back-button"
          type="button"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <span aria-hidden="true">←</span>
        </button>
      ) : null}
      <Link
        className={`member-mobile-logo ${pathname !== "/member" ? "member-mobile-logo-with-back" : ""}`}
        href="/member"
        aria-label="GerejaHub member home"
      >
        <img src="/media/logo.png" alt="" />
      </Link>
      <button
        className="member-mobile-menu-button"
        type="button"
        aria-label={isOpen ? "Close member navigation" : "Open member navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="sr-only">{isOpen ? "Close member navigation" : "Open member navigation"}</span>
        <span className="member-mobile-menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      {isOpen ? (
        <>
          <button
            className="member-mobile-backdrop"
            type="button"
            aria-label="Close member navigation"
            onClick={() => setIsOpen(false)}
          />
          <aside className="member-mobile-drawer">
            <MemberNavigation profile={profile} onNavigate={() => setIsOpen(false)} />
          </aside>
        </>
      ) : null}
    </div>
  );
}
