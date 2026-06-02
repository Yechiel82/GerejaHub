import { AdminShell } from "./admin-shell";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const [sermons, events, ministries, messages] = await Promise.all([
    supabase.from("sermons").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("ministries").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5) as any
  ]);

  const stats = [
    ["Sermons", sermons.count ?? 0],
    ["Events", events.count ?? 0],
    ["Ministries", ministries.count ?? 0],
    ["Messages", messages.data?.length ?? 0]
  ];

  return (
    <AdminShell email={user.email}>
      <div className="admin-heading">
        <p className="section-kicker">Phase 2</p>
        <h1>Admin Dashboard</h1>
        <p>Manage public church content from Supabase.</p>
      </div>
      <div className="admin-stats">
        {stats.map(([label, count]) => (
          <article key={label} className="admin-stat">
            <span>{label}</span>
            <strong>{count}</strong>
          </article>
        ))}
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Latest Messages</h2>
          <p>Contact submissions from the public site.</p>
        </div>
        <div className="admin-list">
          {messages.data?.length ? (
            messages.data.map((message: any) => (
              <article key={message.id}>
                <strong>{message.name}</strong>
                <span>{message.email}</span>
                <p>{message.message}</p>
              </article>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
