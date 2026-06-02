import { MemberShell } from "../member-shell";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PrayerForm } from "./prayer-form";
import { PrayerItem } from "./prayer-item";
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

  // Get community prayer requests (shared with church) - using simple query for now
  const { data: communityPrayers, error: communityError } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("visibility", "church")
    .order("created_at", { ascending: false })
    .limit(20);

  // Debug logging
  console.log('=== PRAYER WALL DEBUG ===');
  console.log('Community Prayers:', communityPrayers);
  console.log('Community Error:', communityError);
  console.log('========================');

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
        {/* DEBUG INFO - Remove after fixing */}
        <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <strong>🔍 DEBUG INFO:</strong><br/>
          User ID: {user.id}<br/>
          Community Prayers Count: {communityPrayers?.length || 0}<br/>
          Community Error: {communityError ? JSON.stringify(communityError) : 'null'}<br/>
          {communityPrayers && communityPrayers.length > 0 && (
            <>
              <br/><strong>Data:</strong><br/>
              <pre style={{ fontSize: '0.75rem', overflow: 'auto' }}>{JSON.stringify(communityPrayers, null, 2)}</pre>
            </>
          )}
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
