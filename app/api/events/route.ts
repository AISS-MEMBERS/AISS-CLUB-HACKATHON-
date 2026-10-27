import { NextRequest, NextResponse } from "next/server";
import {
  createApiErrorResponse,
  fetchPublishedEvents,
  validatePagination,
} from "@/lib/backend/events";


/**
 * Public GET /api/events
 * Returns published club events ordered by startsAt ascending, then id.
 * Pagination: default page 1, limit 20, max limit 50.
 */
export async function GET(request: NextRequest) {
  try {
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
        { status: 400 }
      );
    }

    const data = await fetchPublishedEvents(paginationResult.data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
