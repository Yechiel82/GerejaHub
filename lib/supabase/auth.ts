import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

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
    return true;
  }

  const admins = configuredEmails
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && admins.includes(email.toLowerCase()));
}

export async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/admin/login?error=This%20Google%20account%20is%20not%20allowed");
  }

  return user;
}
