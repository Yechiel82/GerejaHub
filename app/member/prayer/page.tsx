import { MemberShell } from "../member-shell";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PrayerForm } from "./prayer-form";
import { PrayerItem } from "./prayer-item";
import { PrayedButton } from "./prayed-button";
import { formatDisplayDate } from "@/lib/data/content";

export default async function PrayerPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  
  // Get user's own prayer requests (exclude soft-deleted)
  const { data: prayerRequests } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Get community prayer requests from OTHER members (exclude current user, soft-deleted, and hidden)
  const { data: communityPrayers } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("visibility", "church")
    .neq("user_id", user.id)
    .is("deleted_at", null)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(20);

  // Get user's prayer interactions to show which prayers they've prayed for
  const { data: userInteractions } = await supabase
    .from("prayer_interactions")
    .select("prayer_id")
    .eq("user_id", user.id);

  const prayedPrayerIds = new Set(
    userInteractions?.map((i: any) => i.prayer_id) || []
  );

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
                  <strong>{prayer.is_anonymous ? 'Anonymous' : prayer.name}</strong>
                  <span className="prayer-date">
                    {formatDisplayDate(prayer.created_at)}
                  </span>
                </div>
                <p className="prayer-request">{prayer.request}</p>
                <div className="prayer-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`status-badge status-${prayer.status}`}>
                      {prayer.status}
                    </span>
                    {prayer.prayer_count > 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        🙏 {prayer.prayer_count} {prayer.prayer_count === 1 ? 'person' : 'people'} prayed
                      </span>
                    )}
                  </div>
                  <PrayedButton
                    prayerId={prayer.id}
                    hasPrayed={prayedPrayerIds.has(prayer.id)}
                  />
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
              <PrayerItem key={item.id} prayer={item} />
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
