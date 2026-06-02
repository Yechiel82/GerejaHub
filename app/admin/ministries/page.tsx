import { AdminShell } from "../admin-shell";
import { createMinistry, deleteMinistry, updateMinistry } from "../actions";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MinistriesPage() {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { data: ministries } = await supabase.from("ministries").select("*").order("sort_order", { ascending: true }) as any;

  return (
    <AdminShell email={user.email}>
      <div className="admin-heading">
        <p className="section-kicker">Content</p>
        <h1>Ministries</h1>
        <p>Manage the ministry tiles shown on the public site.</p>
      </div>
      <form className="admin-form admin-panel" action={createMinistry}>
        <div className="admin-panel-heading"><h2>New Ministry</h2></div>
        <label>Name<input name="name" required /></label>
        <label>Sort order<input name="sort_order" type="number" defaultValue={0} /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <label className="check-row"><input name="published" type="checkbox" defaultChecked /> Published</label>
        <button className="button primary" type="submit">Create Ministry</button>
      </form>
      <div className="admin-stack">
        {(ministries ?? []).map((ministry: any) => (
          <form key={ministry.id} className="admin-form admin-panel" action={updateMinistry}>
            <input name="id" type="hidden" value={ministry.id} />
            <label>Name<input name="name" defaultValue={ministry.name} required /></label>
            <label>Sort order<input name="sort_order" type="number" defaultValue={ministry.sort_order} /></label>
            <label>Description<textarea name="description" rows={3} defaultValue={ministry.description ?? ""} /></label>
            <label className="check-row"><input name="published" type="checkbox" defaultChecked={ministry.published} /> Published</label>
            <div className="admin-actions">
              <button className="button primary" type="submit">Save</button>
              <button className="button danger" formAction={deleteMinistry} type="submit">Delete</button>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
