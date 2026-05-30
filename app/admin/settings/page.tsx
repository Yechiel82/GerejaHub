import { AdminShell } from "../admin-shell";
import { upsertSettings } from "../actions";
import { fallbackSettings } from "@/lib/data/fallback";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("church_settings").select("*").eq("id", "site").maybeSingle();
  const settings = data ?? fallbackSettings;

  return (
    <AdminShell email={user.email}>
      <div className="admin-heading">
        <p className="section-kicker">Site Content</p>
        <h1>Settings</h1>
        <p>Update the homepage hero, visit details, and giving note.</p>
      </div>
      <form className="admin-form admin-panel" action={upsertSettings}>
        <label>
          Hero eyebrow
          <input name="hero_eyebrow" defaultValue={settings.hero_eyebrow} required />
        </label>
        <label>
          Hero title
          <input name="hero_title" defaultValue={settings.hero_title} required />
        </label>
        <label>
          Hero description
          <textarea name="hero_description" defaultValue={settings.hero_description} rows={4} required />
        </label>
        <label>
          Service time
          <input name="service_time" defaultValue={settings.service_time} required />
        </label>
        <label>
          Address
          <input name="address" defaultValue={settings.address} required />
        </label>
        <label>
          Email
          <input name="email" type="email" defaultValue={settings.email} required />
        </label>
        <label>
          Giving note
          <textarea name="giving_note" defaultValue={settings.giving_note} rows={4} required />
        </label>
        <button className="button primary" type="submit">Save Settings</button>
      </form>
    </AdminShell>
  );
}
