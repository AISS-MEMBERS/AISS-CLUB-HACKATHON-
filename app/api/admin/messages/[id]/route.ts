// app/api/admin/messages/[id]/route.ts
// Route handler for updating contact message status.
// PATCH /api/admin/messages/[id]

import { NextResponse } from "next/server";
import { updateAdminMessageStatus } from "@/lib/backend/contact/service";
import { ApiResult, ContactMessage } from "@/lib/backend/contact/types";
import {
  isValidUuid,
  readBoundedJson,
  validateSameOrigin,
  validateStatusUpdate,
} from "@/lib/backend/contact/validation";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResult<ContactMessage>>> {
  // 1. Same-origin protection for mutations
  if (!validateSameOrigin(request)) {
    return NextResponse.json<ApiResult<ContactMessage>>(
      {
        success: false,
        error: {
          code: "FORBIDDEN_ORIGIN",
          message: "Cross-origin requests are forbidden.",
        },
      },
      {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 2. Resolve dynamic route params (Next.js 16 Promise convention)
  const { id } = await params;
  if (!id || !isValidUuid(id)) {
    return NextResponse.json<ApiResult<ContactMessage>>(
      {
        success: false,
        error: {
          code: "INVALID_IDENTIFIER",
          message: "Message ID must be a valid UUID.",
        },
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 3. Read bounded JSON body (16 KiB max)
  const bodyResult = await readBoundedJson(request);
  if (!bodyResult.ok) {
    return NextResponse.json<ApiResult<ContactMessage>>(
      {
        success: false,
        error: {
          code: bodyResult.code,
          message: bodyResult.message,
        },
      },
      {
        status: bodyResult.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 4. Validate status update payload (accepts only status: "new" | "read" | "archived")
  const validation = validateStatusUpdate(bodyResult.data);
  if (!validation.ok) {
    return NextResponse.json<ApiResult<ContactMessage>>(
      {
        success: false,
        error: {
          code: validation.code,
          message: validation.message,
        },
      },
      {
        status: validation.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 5. Update message in database using user-scoped client and RLS
  const result = await updateAdminMessageStatus(
    request,
    id,
    validation.data.status
  );

  if (!result.ok || !result.data) {
    return NextResponse.json<ApiResult<ContactMessage>>(
      {
        success: false,
        error: {
          code: result.code || "UPDATE_FAILED",
          message: result.message || "Failed to update message.",
        },
      },
      {
        status: result.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json<ApiResult<ContactMessage>>(
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
