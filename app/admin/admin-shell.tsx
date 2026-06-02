import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "./actions";

const adminNav = [
  ["Dashboard", "/admin"],
  ["Settings", "/admin/settings"],
  ["Sermons", "/admin/sermons"],
  ["Events", "/admin/events"],
  ["Ministries", "/admin/ministries"],
  ["Prayer", "/admin/prayer"]
];

export function AdminShell({ children, email }: { children: ReactNode; email?: string | null }) {
  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <img src="/media/logo.png" alt="GerejaHub" className="sidebar-logo" />
          <span>GerejaHub Admin</span>
        </Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          {adminNav.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-account">
          <span>{email}</span>
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <section className="admin-content">{children}</section>
    </main>
  );
}
