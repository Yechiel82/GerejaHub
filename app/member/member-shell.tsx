import type { ReactNode } from "react";
import type { Profile } from "@/lib/supabase/types";
import { MemberResponsiveNav } from "./member-responsive-nav";

export function MemberShell({ children, profile }: { children: ReactNode; profile: Profile }) {
  return (
    <main className="admin-page member-page">
      <MemberResponsiveNav profile={profile} />
      <section className="admin-content">{children}</section>
    </main>
  );
}
