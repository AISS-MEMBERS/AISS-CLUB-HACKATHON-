import { NextResponse } from "next/server";
import { ApiError, toErrorResponse } from "@/lib/backend/shared/api";
import { requireSameOrigin, readJsonBody, enforceLoginRateLimit } from "@/lib/backend/shared/request";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await enforceLoginRateLimit(request);
    const input = await readJsonBody(request, 4096);
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Email and password are required.");
    }
    const body = input as Record<string, unknown>;
    if (Object.keys(body).some(key => !["email", "password"].includes(key)) ||
        typeof body.email !== "string" || body.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
        typeof body.password !== "string" || body.password.length < 1 || body.password.length > 1024) {
      throw new ApiError(400, "VALIDATION_ERROR", "Enter a valid email and password.");
    }
    const client = await createServerSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({ email: body.email.trim(), password: body.password });
    if (error || !data.user) {
      if (error && (!error.status || error.status >= 500)) {
        throw new ApiError(503, "SERVICE_UNAVAILABLE", "The login service is unavailable.");
      }
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }
    const { data: admin, error: membershipError } = await client.from("admin_users")
      .select("user_id").eq("user_id", data.user.id).maybeSingle();
    if (membershipError || !admin) {
      await client.auth.signOut({ scope: "local" });
      if (membershipError) throw new ApiError(503, "SERVICE_UNAVAILABLE", "Unable to verify administrator access.");
      throw new ApiError(403, "FORBIDDEN", "This account does not have administrator access.");
    }
    return NextResponse.json({ success: true, data: { signedIn: true } },
      { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return toErrorResponse(error); }
}
