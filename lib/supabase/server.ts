import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { ApiError } from "@/lib/backend/shared/api";

/**
 * Creates a server-side user-scoped Supabase client that reads and writes
 * the user session from Next.js request cookies.
 * Enforces RLS based on the user's authenticated session.
 */
export async function createServerSupabaseClient(): Promise<
  SupabaseClient<Database>
> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !url ||
    !publishableKey ||
    url.includes("YOUR_PROJECT_REF") ||
    publishableKey.includes("REPLACE")
  ) {
    throw new ApiError(
      503,
      "SERVICE_UNAVAILABLE",
      "Supabase service configuration is missing or incomplete."
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
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
