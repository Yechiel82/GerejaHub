import { AdminShell } from "../admin-shell";
import { createSermon, deleteSermon, updateSermon } from "../actions";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SermonsPage() {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { data: sermons } = await supabase.from("sermons").select("*").order("sermon_date", { ascending: false }) as any;

  return (
    <AdminShell email={user.email}>
      <div className="admin-heading">
        <p className="section-kicker">Content</p>
        <h1>Sermons</h1>
        <p>Add, edit, publish, or hide sermon entries.</p>
      </div>
      <form className="admin-form admin-panel" action={createSermon}>
        <div className="admin-panel-heading"><h2>New Sermon</h2></div>
        <label>Title<input name="title" required /></label>
        <label>Speaker<input name="speaker" required /></label>
        <label>Date<input name="sermon_date" type="date" required /></label>
        <label>Media URL<input name="media_url" type="url" /></label>
        <label>Summary<textarea name="summary" rows={3} /></label>
        <label className="check-row"><input name="published" type="checkbox" defaultChecked /> Published</label>
        <button className="button primary" type="submit">Create Sermon</button>
      </form>
      <div className="admin-stack">
        {(sermons ?? []).map((sermon: any) => (
          <form key={sermon.id} className="admin-form admin-panel" action={updateSermon}>
            <input name="id" type="hidden" value={sermon.id} />
            <label>Title<input name="title" defaultValue={sermon.title} required /></label>
            <label>Speaker<input name="speaker" defaultValue={sermon.speaker} required /></label>
            <label>Date<input name="sermon_date" type="date" defaultValue={sermon.sermon_date} required /></label>
            <label>Media URL<input name="media_url" type="url" defaultValue={sermon.media_url ?? ""} /></label>
            <label>Summary<textarea name="summary" rows={3} defaultValue={sermon.summary ?? ""} /></label>
            <label className="check-row"><input name="published" type="checkbox" defaultChecked={sermon.published} /> Published</label>
            <div className="admin-actions">
              <button className="button primary" type="submit">Save</button>
              <button className="button danger" formAction={deleteSermon} type="submit">Delete</button>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
