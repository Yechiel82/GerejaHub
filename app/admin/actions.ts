"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableValue(formData: FormData, key: string) {
  const nextValue = value(formData, key);
  return nextValue || null;
}

function isPublished(formData: FormData) {
  return formData.get("published") === "on";
}

async function getAdminSupabase() {
  await requireAdminUser();
  return createSupabaseServerClient();
}

export async function signIn(formData: FormData) {
  const email = value(formData, "email");
  const password = value(formData, "password");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=Invalid%20email%20or%20password");
  }

  redirect("/admin");
}

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/admin`,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error || !data.url) {
    redirect("/admin/login?error=Google%20sign-in%20could%20not%20start");
  }

  redirect(data.url);
}

export async function signInWithGoogleForMember() {
  const supabase = await createSupabaseServerClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/member`,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error || !data.url) {
    redirect("/member/login?error=Google%20sign-in%20could%20not%20start");
  }

  redirect(data.url);
}
function redirectWithError(path: string, message: string) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function upsertSettings(formData: FormData) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("church_settings").upsert(
    {
      id: "site",
      hero_eyebrow: value(formData, "hero_eyebrow"),
      hero_title: value(formData, "hero_title"),
      hero_description: value(formData, "hero_description"),
      service_time: value(formData, "service_time"),
      address: value(formData, "address"),
      email: value(formData, "email"),
      giving_note: value(formData, "giving_note")
    } as any,
    { onConflict: "id" }
  );

  if (error) {
    redirectWithError("/admin/settings", error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function createSermon(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("sermons").insert({
    title: value(formData, "title"),
    speaker: value(formData, "speaker"),
    sermon_date: value(formData, "sermon_date"),
    summary: nullableValue(formData, "summary"),
    media_url: nullableValue(formData, "media_url"),
    published: isPublished(formData)
  } as any);
  revalidatePath("/");
  revalidatePath("/admin/sermons");
}

export async function updateSermon(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase
    .from("sermons")
    // @ts-ignore - Supabase type inference issue
    .update({
      title: value(formData, "title"),
      speaker: value(formData, "speaker"),
      sermon_date: value(formData, "sermon_date"),
      summary: nullableValue(formData, "summary"),
      media_url: nullableValue(formData, "media_url"),
      published: isPublished(formData)
    })
    .eq("id", value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/sermons");
}

export async function deleteSermon(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("sermons").delete().eq("id", value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/sermons");
}

export async function createEvent(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("events").insert({
    title: value(formData, "title"),
    event_date: nullableValue(formData, "event_date"),
    time_label: value(formData, "time_label"),
    location: value(formData, "location"),
    description: nullableValue(formData, "description"),
    published: isPublished(formData)
  } as any);
  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function updateEvent(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase
    .from("events")
    // @ts-ignore - Supabase type inference issue
    .update({
      title: value(formData, "title"),
      event_date: nullableValue(formData, "event_date"),
      time_label: value(formData, "time_label"),
      location: value(formData, "location"),
      description: nullableValue(formData, "description"),
      published: isPublished(formData)
    })
    .eq("id", value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("events").delete().eq("id", value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function createMinistry(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("ministries").insert({
    name: value(formData, "name"),
    description: nullableValue(formData, "description"),
    sort_order: Number(value(formData, "sort_order") || 0),
    published: isPublished(formData)
  } as any);
  revalidatePath("/");
  revalidatePath("/admin/ministries");
}

export async function updateMinistry(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase
    .from("ministries")
    // @ts-ignore - Supabase type inference issue
    .update({
      name: value(formData, "name"),
      description: nullableValue(formData, "description"),
      sort_order: Number(value(formData, "sort_order") || 0),
      published: isPublished(formData)
    })
    .eq("id", value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/ministries");
}

export async function deleteMinistry(formData: FormData) {
  const supabase = await getAdminSupabase();
  await supabase.from("ministries").delete().eq("id", value(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/ministries");
}
