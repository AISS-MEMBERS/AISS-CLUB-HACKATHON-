import { NextRequest, NextResponse } from "next/server";
import {
  createAdminEvent,
  createApiErrorResponse,
  fetchAdminEvents,
  parseJsonBody,
  requireAdminAuth,
  validateEventWriteInput,
  validatePagination,
  verifySameOrigin,
} from "@/lib/backend/events";


/**
 * Admin GET /api/admin/events
 * Returns all events (drafts, published, archived) ordered by startsAt descending, then id.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

    const searchParams = request.nextUrl.searchParams;
    const paginationResult = validatePagination(
      searchParams.get("page"),
      searchParams.get("limit")
    );

    if (!paginationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: paginationResult.message,
            fieldErrors: paginationResult.fieldErrors,
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await fetchAdminEvents(paginationResult.data);

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return createApiErrorResponse(error);
  }
}

/**
 * Admin POST /api/admin/events
 * Creates a new event. Checks origin, validates complete EventWriteInput,
 * enforces single featured published invariant, returns HTTP 201 on success.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();
    verifySameOrigin(request);

    const body = await parseJsonBody(request);
    const validationResult = validateEventWriteInput(body);

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

    const newEvent = await createAdminEvent(validationResult.data);

    return NextResponse.json(
      { success: true, data: newEvent },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
