import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { publicSupabaseConfig } from "@/lib/backend/shared/config";

/**
 * Creates a server-side user-scoped Supabase client that reads and writes
 * the user session from Next.js request cookies.
 * Enforces RLS based on the user's authenticated session.
 */
export async function createServerSupabaseClient(): Promise<
  SupabaseClient<Database>
> {
  const { url, key: publishableKey } = publicSupabaseConfig();

  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10000) }) },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if middleware or route handlers refresh sessions.
        }
      },
    },
  });
}
