import { AdminShell } from "../admin-shell";
import { createEvent, deleteEvent, updateEvent } from "../actions";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EventsPage() {
  const user = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { data: events } = await supabase.from("events").select("*").order("created_at", { ascending: false }) as any;

  return (
    <AdminShell email={user.email}>
      <div className="admin-heading">
        <p className="section-kicker">Content</p>
        <h1>Events</h1>
        <p>Manage worship services, gatherings, and upcoming church events.</p>
      </div>
      <form className="admin-form admin-panel" action={createEvent}>
        <div className="admin-panel-heading"><h2>New Event</h2></div>
        <label>Title<input name="title" required /></label>
        <label>Event date<input name="event_date" type="date" /></label>
        <label>Time label<input name="time_label" placeholder="Every Sunday, 9:00 AM" required /></label>
        <label>Location<input name="location" required /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <label className="check-row"><input name="published" type="checkbox" defaultChecked /> Published</label>
        <button className="button primary" type="submit">Create Event</button>
      </form>
      <div className="admin-stack">
        {(events ?? []).map((event: any) => (
          <form key={event.id} className="admin-form admin-panel" action={updateEvent}>
            <input name="id" type="hidden" value={event.id} />
            <label>Title<input name="title" defaultValue={event.title} required /></label>
            <label>Event date<input name="event_date" type="date" defaultValue={event.event_date ?? ""} /></label>
            <label>Time label<input name="time_label" defaultValue={event.time_label} required /></label>
            <label>Location<input name="location" defaultValue={event.location} required /></label>
            <label>Description<textarea name="description" rows={3} defaultValue={event.description ?? ""} /></label>
            <label className="check-row"><input name="published" type="checkbox" defaultChecked={event.published} /> Published</label>
            <div className="admin-actions">
              <button className="button primary" type="submit">Save</button>
              <button className="button danger" formAction={deleteEvent} type="submit">Delete</button>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
