import { redirect } from "next/navigation";
import { signInWithGoogle } from "../actions";
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
      <form className="login-card" action={signInWithGoogle}>
        <a href="/" className="login-logo-link">
          <img src="/media/logo.png" alt="GerejaHub" className="login-logo" />
        </a>
        <div>
          <p className="section-kicker">Admin</p>
          <h1>Sign in to GerejaHub</h1>
        </div>
        <a href="/" className="back-link">← Back to Home</a>
        {params.error ? <p className="form-error">{params.error}</p> : null}
        <button className="google-button" type="submit">
          <span>G</span>
          Continue with Google
        </button>
      </form>
    </main>
  );
}
