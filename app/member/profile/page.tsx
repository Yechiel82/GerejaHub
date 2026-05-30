import { MemberShell } from "../member-shell";
import { updateMemberProfile } from "../actions";
import { requireMemberUser } from "@/lib/supabase/auth";

export default async function ProfilePage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { profile } = await requireMemberUser();

  return (
    <MemberShell profile={profile}>
      <div className="admin-heading">
        <p className="section-kicker">Account</p>
        <h1>Profile</h1>
        <p>Keep your member information updated.</p>
      </div>
      {params.saved ? <p className="form-success">Profile saved.</p> : null}
      {params.error ? <p className="form-error">{params.error}</p> : null}
      <form className="admin-form admin-panel" action={updateMemberProfile}>
        <label>Email<input value={profile.email} disabled /></label>
        <label>Full name<input name="full_name" defaultValue={profile.full_name ?? ""} /></label>
        <label>Role<input value={profile.role} disabled /></label>
        <button className="button primary" type="submit">Save Profile</button>
      </form>
    </MemberShell>
  );
}
