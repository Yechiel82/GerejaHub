"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMemberUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitPrayerRequest(formData: FormData) {
  const { user, profile } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("prayer_requests").insert({
    user_id: user.id,
    name: value(formData, "name") || profile.full_name || profile.email,
    request: value(formData, "request"),
    visibility: value(formData, "visibility") === "church" ? "church" : "private"
  } as any);

  if (error) {
    redirect("/member/prayer?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/member");
  revalidatePath("/member/prayer");
  redirect("/member/prayer?saved=1");
}

export async function updateMemberProfile(formData: FormData) {
  const { user } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    // @ts-ignore - Supabase type inference issue
    .update({ full_name: value(formData, "full_name") })
    .eq("id", user.id);

  if (error) {
    redirect("/member/profile?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/member");
  revalidatePath("/member/profile");
  redirect("/member/profile?saved=1");
}
