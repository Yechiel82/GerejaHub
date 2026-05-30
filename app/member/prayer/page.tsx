import { MemberShell } from "../member-shell";
import { submitPrayerRequest } from "../actions";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PrayerPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  const { data: prayerRequests } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Prayer</p>
        <h1>Prayer Requests</h1>
        <p>Share requests privately with church leaders or with the church community.</p>
      </div>
      {params.saved ? <p className="form-success">Prayer request submitted.</p> : null}
      {params.error ? <p className="form-error">{params.error}</p> : null}
      <form className="admin-form admin-panel" action={submitPrayerRequest}>
        <label>Name<input name="name" defaultValue={profile.full_name ?? ""} /></label>
        <label>Visibility<select name="visibility" defaultValue="private"><option value="private">Private to leaders</option><option value="church">Share with church</option></select></label>
        <label>Request<textarea name="request" rows={5} required /></label>
        <button className="button primary" type="submit">Submit Prayer Request</button>
      </form>
      <section className="admin-panel">
        <div className="admin-panel-heading"><h2>Your Requests</h2></div>
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
    </MemberShell>
  );
}
