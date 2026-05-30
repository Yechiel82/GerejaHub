import Link from "next/link";
import { MemberShell } from "./member-shell";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MemberPage() {
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  const { data: prayerRequests } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Member Area</p>
        <h1>{profile.full_name ? `Welcome, ${profile.full_name}` : "Welcome"}</h1>
        <p>Access community features, prayer requests, and member-only tools.</p>
      </div>
      <div className="admin-stats">
        <article className="admin-stat"><span>Role</span><strong>{profile.role}</strong></article>
        <article className="admin-stat"><span>Prayer Requests</span><strong>{prayerRequests?.length ?? 0}</strong></article>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Recent Prayer Requests</h2>
          <p>Your latest submitted requests.</p>
        </div>
        <div className="admin-list">
          {prayerRequests?.length ? prayerRequests.map((item) => (
            <article key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.visibility} · {item.status}</span>
              <p>{item.request}</p>
            </article>
          )) : <p>No prayer requests yet.</p>}
        </div>
      </section>
      <Link className="button primary" href="/member/prayer">Submit Prayer Request</Link>
    </MemberShell>
  );
}
