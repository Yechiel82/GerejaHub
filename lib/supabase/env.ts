export function getOptionalSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseEnv() {
  const env = getOptionalSupabaseEnv();

  if (!env) {
    throw new Error("Missing Supabase environment variables");
  }

  return env;
}
