import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/backend/shared/request";
import { ApiError, toErrorResponse } from "@/lib/backend/shared/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const client = await createServerSupabaseClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw new ApiError(503, "SERVICE_UNAVAILABLE", "Sign out failed. Please try again.");
    return NextResponse.json({ success: true, data: { signedOut: true } },
      { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return toErrorResponse(error); }
}
