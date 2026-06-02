import type { ReactNode } from "react";
import Link from "next/link";
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

export function MemberShell({ children, profile }: { children: ReactNode; profile: Profile }) {
  return (
    <main className="admin-page member-page">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/member">
          <img src="/media/logo.png" alt="GerejaHub" className="sidebar-logo" />
          <span>GerejaHub Member</span>
        </Link>
        <nav className="admin-nav" aria-label="Member navigation">
          {memberNav.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <div className="admin-account">
          <span>{profile.email}</span>
          <span>{profile.role}</span>
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <section className="admin-content">{children}</section>
    </main>
  );
}
