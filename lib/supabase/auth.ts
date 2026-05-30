import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "./admin";
import { createSupabaseServerClient } from "./server";
import type { Profile } from "./types";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export function isAdminEmail(email?: string | null) {
  const configuredEmails = process.env.ADMIN_EMAILS;

  if (!configuredEmails) {
    return false;
  }

  const admins = configuredEmails
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && admins.includes(email.toLowerCase()));
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { user, profile: data as Profile | null };
}

export async function ensureCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const role = isAdminEmail(user.email) ? "admin" : "member";
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        role
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  return { user, profile: data as Profile | null };
}

export async function requireMemberUser() {
  const { user, profile } = await ensureCurrentProfile();

  if (!user) {
    redirect("/member/login");
  }

  if (!profile) {
    redirect("/member/login?error=Profile%20could%20not%20be%20loaded");
  }

  return { user, profile };
}

export async function requireAdminUser() {
  const { user, profile } = await ensureCurrentProfile();

  if (!user) {
    redirect("/admin/login");
  }

  if (profile?.role !== "admin") {
    redirect("/admin/login?error=This%20account%20is%20not%20allowed");
  }

  return user;
}
