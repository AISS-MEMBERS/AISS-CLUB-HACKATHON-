import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/auth/require-admin";
import { requireSameOrigin } from "@/lib/backend/shared/request";
import { ApiError, toErrorResponse } from "@/lib/backend/shared/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { normalizedCover } from "@/lib/backend/events/cover-upload";
import { COVER_BUCKET } from "@/lib/event-covers";

export async function POST(request: Request) {
  try {
    const { userId } = await requireAdmin();
    requireSameOrigin(request);
    const image = await normalizedCover(request);
    const name = `${userId}/${randomUUID()}.jpg`;
    const client = await createServerSupabaseClient();
    const { error } = await client.storage.from(COVER_BUCKET).upload(name, image, {
      contentType: "image/jpeg", cacheControl: "31536000", upsert: false,
    });
    if (error) throw new ApiError(503, "UPLOAD_UNAVAILABLE", "Fotoğraf yüklenemedi. Storage ayarlarını kontrol edin.");
    return NextResponse.json({ success: true, data: { imagePath: `/api/event-covers/${name}` } },
      { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return toErrorResponse(error); }
}
