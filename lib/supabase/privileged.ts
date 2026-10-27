import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { configured, publicSupabaseConfig } from "@/lib/backend/shared/config";
import { ApiError } from "@/lib/backend/shared/api";

/**
 * Creates an isolated, privileged Supabase client using SUPABASE_SECRET_KEY.
 *
 * CRITICAL SECURITY RULES:
 * 1. This client is strictly server-only and must NEVER be imported into or called from browser code.
 * 2. It must NEVER be used for ordinary admin CRUD. Ordinary admin CRUD MUST use createServerSupabaseClient()
 *    to preserve Row Level Security (RLS) enforcement.
 * 3. It is reserved solely for narrowly scoped system operations: server-side contact message inserts
 *    and rate-limit storage.
 */
export function createPrivilegedSupabaseClient(): SupabaseClient<Database> {
  const { url } = publicSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!configured(secretKey)) throw new ApiError(503, "SERVICE_UNAVAILABLE", "Server configuration is missing.");

  return createClient<Database>(url, secretKey, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10000) }) },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
