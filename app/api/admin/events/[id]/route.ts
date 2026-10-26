import { NextRequest, NextResponse } from "next/server";
import {
  createApiErrorResponse,
  isValidUuid,
  parseJsonBody,
  requireAdminAuth,
  updateAdminEvent,
  validateEventPatchInput,
  verifySameOrigin,
} from "@/lib/backend/events";


interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Admin PATCH /api/admin/events/[id]
 * Updates an event's allowed mutable fields or archives it (via publicationStatus: 'archived').
 * Validates UUID, checks origin, validates mutable fields, maps conflicts to 409, missing to 404.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminAuth();
    verifySameOrigin(request);

    const { id } = await params;
    if (!isValidUuid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: `Invalid event ID format '${id}'. Expected a valid UUID.`,
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const body = await parseJsonBody(request);
    const validationResult = validateEventPatchInput(body);

    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validationResult.message,
            fieldErrors: validationResult.fieldErrors,
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const updatedEvent = await updateAdminEvent(id, validationResult.data);

    return NextResponse.json(
      { success: true, data: updatedEvent },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
