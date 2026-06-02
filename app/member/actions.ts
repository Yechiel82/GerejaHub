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

export async function updatePrayerRequest(formData: FormData) {
  const { user } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  
  const prayerId = value(formData, "prayer_id");
  const request = value(formData, "request");
  
  // Get the prayer to check ownership and creation time
  const { data: prayer } = await supabase
    .from("prayer_requests")
    .select("user_id, created_at")
    .eq("id", prayerId)
    .single();
  
  if (!prayer) {
    redirect("/member/prayer?error=" + encodeURIComponent("Prayer request not found"));
  }
  
  // Check if user owns this prayer
  if ((prayer as any).user_id !== user.id) {
    redirect("/member/prayer?error=" + encodeURIComponent("You can only edit your own prayers"));
  }
  
  // Check if within 15 minutes
  const createdAt = new Date((prayer as any).created_at);
  const now = new Date();
  const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
  
  if (diffMinutes > 15) {
    redirect("/member/prayer?error=" + encodeURIComponent("Prayer can only be edited within 15 minutes of creation"));
  }
  
  // Update the prayer
  const { error } = await supabase
    .from("prayer_requests")
    .update({ request } as any)
    .eq("id", prayerId);
  
  if (error) {
    redirect("/member/prayer?error=" + encodeURIComponent(error.message));
  }
  
  revalidatePath("/member/prayer");
  revalidatePath("/admin/prayer");
  redirect("/member/prayer?updated=1");
}

export async function deletePrayerRequest(formData: FormData) {
  const { user } = await requireMemberUser();
  const supabase = await createSupabaseServerClient();
  
  const prayerId = value(formData, "prayer_id");
  
  // Get the prayer to check ownership
  const { data: prayer } = await supabase
    .from("prayer_requests")
    .select("user_id")
    .eq("id", prayerId)
    .single();
  
  if (!prayer) {
    redirect("/member/prayer?error=" + encodeURIComponent("Prayer request not found"));
  }
  
  // Check if user owns this prayer
  if ((prayer as any).user_id !== user.id) {
    redirect("/member/prayer?error=" + encodeURIComponent("You can only delete your own prayers"));
  }
  
  // Delete the prayer
  const { error } = await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", prayerId);
  
  if (error) {
    redirect("/member/prayer?error=" + encodeURIComponent(error.message));
  }
  
  revalidatePath("/member/prayer");
  revalidatePath("/admin/prayer");
  redirect("/member/prayer?deleted=1");
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

// Made with Bob
