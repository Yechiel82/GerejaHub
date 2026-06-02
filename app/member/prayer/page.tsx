import { MemberShell } from "../member-shell";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PrayerForm } from "./prayer-form";
import { formatDisplayDate } from "@/lib/data/content";

export default async function PrayerPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  
  // Get user's own prayer requests
  const { data: prayerRequests } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get community prayer requests (shared with church)
  const { data: communityPrayers } = await supabase
    .from("prayer_requests")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .eq("visibility", "church")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Prayer</p>
        <h1>Prayer Requests</h1>
        <p>Share requests privately with church leaders or with the church community.</p>
      </div>

      {/* Prayer Wall - Community Prayers */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>🙏 Prayer Wall</h2>
          <p>Pray for our church community</p>
        </div>
        <div className="prayer-wall">
          {communityPrayers && communityPrayers.length > 0 ? (
            communityPrayers.map((prayer: any) => (
              <article key={prayer.id} className="prayer-card">
                <div className="prayer-header">
                  <strong>{prayer.name}</strong>
                  <span className="prayer-date">
                    {formatDisplayDate(prayer.created_at)}
                  </span>
                </div>
                <p className="prayer-request">{prayer.request}</p>
                <div className="prayer-footer">
                  <span className={`status-badge status-${prayer.status}`}>
                    {prayer.status}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">No community prayer requests yet. Be the first to share!</p>
          )}
        </div>
      </section>

      {/* Collapsible Prayer Form */}
      <PrayerForm 
        defaultName={profile.full_name ?? ""} 
        saved={params.saved}
        error={params.error}
      />

      {/* User's Own Requests */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>My Prayer Requests</h2>
        </div>
        <div className="admin-list">
          {prayerRequests?.length ? (
            prayerRequests.map((item: any) => (
              <article key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.visibility === 'church' ? '🌍 Shared with church' : '🔒 Private to leaders'} · {item.status}</span>
                <p>{item.request}</p>
                <span className="item-meta">
                  {formatDisplayDate(item.created_at)}
                </span>
              </article>
            ))
          ) : (
            <p>No prayer requests yet. Click "+ New Request" above to submit one.</p>
          )}
        </div>
      </section>
    </MemberShell>
  );
}

// Made with Bob
