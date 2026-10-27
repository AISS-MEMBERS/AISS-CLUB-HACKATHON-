import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/backend/shared/api";

/**
 * Validates that the incoming request has a valid, authenticated Supabase session
 * AND that the authenticated user is recorded in the public.admin_users table.
 *
 * Throws ApiError(401, "UNAUTHORIZED", ...) if no session exists or the token is invalid.
 * Throws ApiError(403, "FORBIDDEN", ...) if the user is authenticated but not an admin.
 * Throws ApiError(503, ...) if Supabase configuration is missing (fails closed).
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    if (authError && (!authError.status || authError.status >= 500)) {
      throw new ApiError(503, "SERVICE_UNAVAILABLE", "The authentication service is unavailable.");
    }
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Authentication required. Please sign in to access this resource."
    );
  }

  // Check membership in public.admin_users using the user-scoped client
  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "Unable to verify administrator access.");
  }
  if (!adminRecord) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "Access denied. You do not have administrator permissions."
    );
  }

  return { userId: user.id };
}
