import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a browser-scoped Supabase client for client-side components.
 * Uses only the public URL and publishable key.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !url ||
    !publishableKey ||
    url.includes("YOUR_PROJECT_REF") ||
    publishableKey.includes("REPLACE")
  ) {
    throw new Error(
      "Missing or unconfigured Supabase public environment variables."
    );
  }

  return createBrowserClient<Database>(url, publishableKey);
}
