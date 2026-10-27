import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { publicSupabaseConfig } from "@/lib/backend/shared/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  let config;
  try { config = publicSupabaseConfig(); } catch { return response; }
  const client = createServerClient<Database>(config.url, config.key, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10000) }) },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });
  // Refresh only. Every protected page/API still validates its own session and role.
  try { await client.auth.getClaims(); } catch { /* Downstream guards fail closed. */ }
  return response;
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/logout", "/login"] };
