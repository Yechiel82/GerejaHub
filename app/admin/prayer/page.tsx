import { AdminShell } from "../admin-shell";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatDisplayDate } from "@/lib/data/content";
import { DeleteButton } from "./delete-button";

export default async function AdminPrayerPage() {
  const user = await requireAdminUser();
  const supabase = createSupabaseAdminClient();
  
  // Get ALL prayer requests (both private and church-wide) for admin view
  const { data: allPrayers, error: prayersError } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  console.log('=== ADMIN PRAYER DEBUG ===');
  console.log('All Prayers:', allPrayers);
  console.log('Error:', prayersError);
  console.log('Count:', allPrayers?.length || 0);
  console.log('========================');

  // Separate private and church prayers
  const privatePrayers = allPrayers?.filter((p: any) => p.visibility === 'private') || [];
  const churchPrayers = allPrayers?.filter((p: any) => p.visibility === 'church') || [];

  return (
    <AdminShell email={user.email}>
      <div className="admin-heading">
        <p className="section-kicker">Prayer Management</p>
        <h1>All Prayer Requests</h1>
        <p>View and manage all prayer requests from church members.</p>
      </div>

      {/* Private Prayer Requests - Only visible to admins */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>🔒 Private Prayer Requests</h2>
          <p>Confidential requests shared only with church leaders</p>
        </div>
        <div className="admin-list">
          {privatePrayers.length > 0 ? (
            privatePrayers.map((prayer: any) => (
              <article key={prayer.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <strong>{prayer.name}</strong>
                    <span style={{ marginLeft: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      User ID: {prayer.user_id.substring(0, 8)}...
                    </span>
                  </div>
                  <span className={`status-badge status-${prayer.status}`}>
                    {prayer.status}
                  </span>
                </div>
                <p>{prayer.request}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span className="item-meta">
                    🔒 Private · {formatDisplayDate(prayer.created_at)}
                  </span>
                  <DeleteButton
                    prayerId={prayer.id}
                    prayerName={prayer.name}
                  />
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">No private prayer requests.</p>
          )}
        </div>
      </section>

      {/* Church-Wide Prayer Requests */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>🌍 Church-Wide Prayer Requests</h2>
          <p>Public requests visible to all church members</p>
        </div>
        <div className="admin-list">
          {churchPrayers.length > 0 ? (
            churchPrayers.map((prayer: any) => (
              <article key={prayer.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <strong>{prayer.name}</strong>
                    <span style={{ marginLeft: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      User ID: {prayer.user_id.substring(0, 8)}...
                    </span>
                  </div>
                  <span className={`status-badge status-${prayer.status}`}>
                    {prayer.status}
                  </span>
                </div>
                <p>{prayer.request}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span className="item-meta">
                    🌍 Church-wide · {formatDisplayDate(prayer.created_at)}
                  </span>
                  <DeleteButton
                    prayerId={prayer.id}
                    prayerName={prayer.name}
                  />
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">No church-wide prayer requests.</p>
          )}
        </div>
      </section>

      {/* Summary Stats */}
      <div className="admin-stats">
        <div className="admin-stat">
          <span>Total Requests</span>
          <strong>{allPrayers?.length || 0}</strong>
        </div>
        <div className="admin-stat">
          <span>Private</span>
          <strong>{privatePrayers.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Church-Wide</span>
          <strong>{churchPrayers.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Active</span>
          <strong>{allPrayers?.filter((p: any) => p.status === 'new').length || 0}</strong>
        </div>
      </div>
    </AdminShell>
  );
}

// Made with Bob
