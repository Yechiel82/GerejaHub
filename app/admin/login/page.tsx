import { redirect } from "next/navigation";
import { signIn, signInWithGoogle } from "../actions";
import { getCurrentUser, isAdminEmail } from "@/lib/supabase/auth";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user && isAdminEmail(user.email)) {
    redirect("/admin");
  }

  return (
    <main className="login-page">
      <form className="login-card" action={signIn}>
        <span className="brand-mark">GH</span>
        <div>
          <p className="section-kicker">Admin</p>
          <h1>Sign in to GerejaHub</h1>
        </div>
        {params.error ? <p className="form-error">{params.error}</p> : null}
        <button className="google-button" formAction={signInWithGoogle} formNoValidate type="submit">
          <span>G</span>
          Continue with Google
        </button>
        <div className="login-divider"><span>or</span></div>
        <label>
          Email
          <input name="email" type="email" placeholder="admin@gerejahub.org" required />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Your password" required />
        </label>
        <button className="button primary" type="submit">
          Sign In
        </button>
      </form>
    </main>
  );
}
