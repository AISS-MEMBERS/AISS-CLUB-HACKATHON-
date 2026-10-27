import { NextResponse } from "next/server";
import { insertContactMessage } from "@/lib/backend/contact/service";
import { validateContactInput } from "@/lib/backend/contact/validation";
import { sendContactEmailNotification } from "@/lib/backend/email/adapter";
import { ApiError, toErrorResponse } from "@/lib/backend/shared/api";
import { requireSameOrigin, readJsonBody, enforceContactRateLimit } from "@/lib/backend/shared/request";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const validation = validateContactInput(await readJsonBody(request));
    if (!validation.ok) {
      throw new ApiError(validation.status, validation.code, validation.message, validation.fieldErrors);
    }
    await enforceContactRateLimit(request);
    const result = await insertContactMessage(validation.data);
    if (!result.ok || !result.data) {
      throw new ApiError(result.status, result.code ?? "PERSISTENCE_FAILED", result.message ?? "Unable to save the message.");
    }
    const notification = await sendContactEmailNotification(result.data);
    // Operational status only. Never log submitted personal data or provider errors.
    if (!notification.delivered && notification.status === "failed") {
      console.warn("contact_notification_failed", { messageId: result.data.id });
    }
    return NextResponse.json({ success: true, data: { received: true } },
      { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return toErrorResponse(error); }
}
