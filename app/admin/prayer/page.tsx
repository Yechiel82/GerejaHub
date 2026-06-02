import { AdminShell } from "../admin-shell";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatDisplayDate } from "@/lib/data/content";
import { DeleteButton } from "./delete-button";
import { HideButton } from "./hide-button";

export default async function AdminPrayerPage() {
  const user = await requireAdminUser();
  const supabase = createSupabaseAdminClient();
  
  // Get ALL prayer requests (exclude soft-deleted for main view)
  const { data: activePrayers } = await supabase
    .from("prayer_requests")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Get soft-deleted prayers for admin review
  const { data: deletedPrayers } = await supabase
    .from("prayer_requests")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false })
    .limit(10);

  // Separate active prayers by visibility
  const privatePrayers = activePrayers?.filter((p: any) => p.visibility === 'private') || [];
  const churchPrayers = activePrayers?.filter((p: any) => p.visibility === 'church') || [];
  const hiddenPrayers = churchPrayers.filter((p: any) => p.is_hidden);
  const visiblePrayers = churchPrayers.filter((p: any) => !p.is_hidden);

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="item-meta">
                      🔒 Private · {formatDisplayDate(prayer.created_at)}
                    </span>
                    {prayer.prayer_count > 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        🙏 {prayer.prayer_count}
                      </span>
                    )}
                  </div>
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

      {/* Visible Church-Wide Prayers */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>🌍 Visible Church-Wide Prayers</h2>
          <p>Public prayers shown on Prayer Wall</p>
        </div>
        <div className="admin-list">
          {visiblePrayers.length > 0 ? (
            visiblePrayers.map((prayer: any) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="item-meta">
                      🌍 Church-wide · {formatDisplayDate(prayer.created_at)}
                    </span>
                    {prayer.prayer_count > 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        🙏 {prayer.prayer_count}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <HideButton
                      prayerId={prayer.id}
                      isHidden={false}
                    />
                    <DeleteButton
                      prayerId={prayer.id}
                      prayerName={prayer.name}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">No visible church-wide prayers.</p>
          )}
        </div>
      </section>

      {/* Hidden Church-Wide Prayers */}
      {hiddenPrayers.length > 0 && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>👁️ Hidden Church-Wide Prayers</h2>
            <p>Prayers hidden by admin (only creator and admin can see)</p>
          </div>
          <div className="admin-list">
            {hiddenPrayers.map((prayer: any) => (
              <article key={prayer.id} style={{ opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <strong>{prayer.name}</strong>
                    <span style={{ marginLeft: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      User ID: {prayer.user_id.substring(0, 8)}...
                    </span>
                    <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#ffc107', color: '#000', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      HIDDEN
                    </span>
                  </div>
                  <span className={`status-badge status-${prayer.status}`}>
                    {prayer.status}
                  </span>
                </div>
                <p>{prayer.request}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="item-meta">
                      🌍 Church-wide · {formatDisplayDate(prayer.created_at)}
                    </span>
                    {prayer.prayer_count > 0 && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        🙏 {prayer.prayer_count}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <HideButton
                      prayerId={prayer.id}
                      isHidden={true}
                    />
                    <DeleteButton
                      prayerId={prayer.id}
                      prayerName={prayer.name}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Deleted Prayers (Soft Delete) */}
      {deletedPrayers && deletedPrayers.length > 0 && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>🗑️ Recently Deleted Prayers</h2>
            <p>Soft-deleted prayers (last 10)</p>
          </div>
          <div className="admin-list">
            {deletedPrayers.map((prayer: any) => (
              <article key={prayer.id} style={{ opacity: 0.5, textDecoration: 'line-through' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <strong>{prayer.name}</strong>
                    <span style={{ marginLeft: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      {prayer.visibility === 'private' ? '🔒 Private' : '🌍 Church-wide'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    Deleted: {formatDisplayDate(prayer.deleted_at)}
                  </span>
                </div>
                <p>{prayer.request}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Summary Stats */}
      <div className="admin-stats">
        <div className="admin-stat">
          <span>Total Active</span>
          <strong>{activePrayers?.length || 0}</strong>
        </div>
        <div className="admin-stat">
          <span>Private</span>
          <strong>{privatePrayers.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Visible Public</span>
          <strong>{visiblePrayers.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Hidden</span>
          <strong>{hiddenPrayers.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Deleted</span>
          <strong>{deletedPrayers?.length || 0}</strong>
        </div>
      </div>
    </AdminShell>
  );
}

// Made with Bob
