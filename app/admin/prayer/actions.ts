"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function adminDeletePrayerRequest(formData: FormData) {
  await requireAdminUser();
  const supabase = createSupabaseAdminClient();
  
  const prayerId = value(formData, "prayer_id");
  
  // Admin soft delete - set deleted_at timestamp
  const { error } = await supabase
    .from("prayer_requests")
    .update({ deleted_at: new Date().toISOString() } as any)
    .eq("id", prayerId);
  
  if (error) {
    redirect("/admin/prayer?error=" + encodeURIComponent(error.message));
  }
  
  revalidatePath("/member/prayer");
  revalidatePath("/admin/prayer");
  redirect("/admin/prayer?deleted=1");
}

export async function adminToggleHidePrayer(formData: FormData) {
  await requireAdminUser();
  const supabase = createSupabaseAdminClient();
  
  const prayerId = value(formData, "prayer_id");
  const currentHidden = value(formData, "is_hidden") === "true";
  
  // Toggle the is_hidden status
  const { error } = await supabase
    .from("prayer_requests")
    .update({ is_hidden: !currentHidden } as any)
    .eq("id", prayerId);
  
  if (error) {
    redirect("/admin/prayer?error=" + encodeURIComponent(error.message));
  }
  
  revalidatePath("/member/prayer");
  revalidatePath("/admin/prayer");
  redirect("/admin/prayer");
}

export async function adminUpdatePrayerRequest(formData: FormData) {
  await requireAdminUser();
  const supabase = createSupabaseAdminClient();
  
  const prayerId = value(formData, "prayer_id");
  const request = value(formData, "request");
  
  // Admin can edit any prayer without time restriction
  const { error } = await supabase
    .from("prayer_requests")
    .update({ request } as any)
    .eq("id", prayerId);
  
  if (error) {
    redirect("/admin/prayer?error=" + encodeURIComponent(error.message));
  }
  
  revalidatePath("/member/prayer");
  revalidatePath("/admin/prayer");
  redirect("/admin/prayer?updated=1");
}

// Made with Bob
