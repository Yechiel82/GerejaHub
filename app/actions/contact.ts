"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getOptionalSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export async function submitContactMessage(formData: FormData) {
  const env = getOptionalSupabaseEnv();

  if (!env) {
    return;
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return;
  }

  const supabase = createClient<Database>(env.url, env.anonKey);
  await supabase.from("contact_messages").insert({ name, email, message });

  revalidatePath("/");
}
