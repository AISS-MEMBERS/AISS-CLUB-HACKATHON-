import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/auth/require-admin";
import { ApiError, toErrorResponse } from "@/lib/backend/shared/api";
import { requireSameOrigin, readJsonBody } from "@/lib/backend/shared/request";
import { updateAdminMessageStatus } from "@/lib/backend/contact/service";
import { isValidUuid, validateStatusUpdate } from "@/lib/backend/contact/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    requireSameOrigin(request);
    const { id } = await params;
    if (!isValidUuid(id)) throw new ApiError(400, "INVALID_ID", "A valid message ID is required.");
    const validation = validateStatusUpdate(await readJsonBody(request));
    if (!validation.ok) throw new ApiError(validation.status, validation.code, validation.message);
    const result = await updateAdminMessageStatus(request, id, validation.data.status);
    if (!result.ok || !result.data) {
      throw new ApiError(result.status, result.code ?? "UPDATE_FAILED", result.message ?? "Unable to update the message.");
    }
    return NextResponse.json({ success: true, data: result.data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return toErrorResponse(error); }
}
