import { redirect } from "next/navigation";
import { signInWithGoogleForMember } from "@/app/admin/actions";
import { getCurrentProfile } from "@/lib/supabase/auth";

export default async function MemberLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { user } = await getCurrentProfile();
  const params = await searchParams;

  if (user) {
    redirect("/member");
  }

  return (
    <main className="login-page">
      <form className="login-card" action={signInWithGoogleForMember}>
        <img src="/media/logo.png" alt="GerejaHub" className="login-logo" />
        <div>
          <p className="section-kicker">Member</p>
          <h1>Sign in to GerejaHub</h1>
        </div>
        {params.error ? <p className="form-error">{params.error}</p> : null}
        <button className="google-button" type="submit">
          <span>G</span>
          Continue with Google
        </button>
      </form>
    </main>
  );
}
