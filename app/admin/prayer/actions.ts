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
  
  // Admin can delete any prayer
  const { error } = await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", prayerId);
  
  if (error) {
    redirect("/admin/prayer?error=" + encodeURIComponent(error.message));
  }
  
  revalidatePath("/member/prayer");
  revalidatePath("/admin/prayer");
  redirect("/admin/prayer?deleted=1");
}

// Made with Bob
