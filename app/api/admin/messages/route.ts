import { requireAdmin } from "@/lib/backend/auth/require-admin";
import { toErrorResponse } from "@/lib/backend/shared/api";
// app/api/admin/messages/route.ts
// Route handler for admin messages listing.
// GET /api/admin/messages

import { NextRequest, NextResponse } from "next/server";
import { listAdminMessages } from "@/lib/backend/contact/service";
import { ApiResult, ContactMessage } from "@/lib/backend/contact/types";
import { validatePagination } from "@/lib/backend/contact/validation";


export async function GET(
  request: NextRequest
) {
  try { await requireAdmin(); } catch (error) { return toErrorResponse(error); }
  // 1. Validate pagination query parameters
  const pagination = validatePagination(request.nextUrl.searchParams);
  if (!pagination.ok) {
    return NextResponse.json<ApiResult<{ items: ContactMessage[]; page: number }>>(
      {
        success: false,
        error: {
          code: pagination.code,
          message: pagination.message,
        },
      },
      {
        status: pagination.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 2. Fetch messages using authenticated user-scoped client and RLS
  const result = await listAdminMessages(
    request,
    pagination.data.page,
    pagination.data.limit
  );

  if (!result.ok || !result.data) {
    return NextResponse.json<ApiResult<{ items: ContactMessage[]; page: number }>>(
      {
        success: false,
        error: {
          code: result.code || "INTERNAL_ERROR",
          message: result.message || "Failed to retrieve messages.",
        },
      },
      {
        status: result.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json<ApiResult<{ items: ContactMessage[]; page: number }>>(
    {
      success: true,
      data: result.data,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
