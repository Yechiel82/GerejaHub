import { createClient } from "@supabase/supabase-js";
import { getOptionalSupabaseEnv } from "@/lib/supabase/env";
import type { ChurchEvent, ChurchSettings, Database, Ministry, Sermon } from "@/lib/supabase/types";
import { fallbackEvents, fallbackMinistries, fallbackSermons, fallbackSettings } from "./fallback";

export type SiteContent = {
  settings: ChurchSettings;
  sermons: Sermon[];
  events: ChurchEvent[];
  ministries: Ministry[];
};

export async function getPublicContent(): Promise<SiteContent> {
  const env = getOptionalSupabaseEnv();

  if (!env) {
    return getFallbackContent();
  }

  const supabase = createClient<Database>(env.url, env.anonKey);
  const [settings, sermons, events, ministries] = await Promise.all([
    supabase.from("church_settings").select("*").eq("id", "site").maybeSingle(),
    supabase
      .from("sermons")
      .select("*")
      .eq("published", true)
      .order("sermon_date", { ascending: false })
      .limit(3),
    supabase.from("events").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3),
    supabase.from("ministries").select("*").eq("published", true).order("sort_order", { ascending: true })
  ]);

  return {
    settings: settings.data ?? fallbackSettings,
    sermons: sermons.data?.length ? sermons.data : fallbackSermons,
    events: events.data?.length ? events.data : fallbackEvents,
    ministries: ministries.data?.length ? ministries.data : fallbackMinistries
  };
}

export function getFallbackContent(): SiteContent {
  return {
    settings: fallbackSettings,
    sermons: fallbackSermons,
    events: fallbackEvents,
    ministries: fallbackMinistries
  };
}

export function formatDisplayDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}
