// app/api/contact/route.ts
// Route handler for public contact message submission.
// POST /api/contact

import { NextResponse } from "next/server";
import { checkContactRateLimit } from "@/lib/backend/contact/rate-limit";
import { insertContactMessage } from "@/lib/backend/contact/service";
import { ApiResult } from "@/lib/backend/contact/types";
import {
  readBoundedJson,
  validateContactInput,
  validateSameOrigin,
} from "@/lib/backend/contact/validation";
import { sendContactEmailNotification } from "@/lib/backend/email/adapter";


export async function POST(request: Request): Promise<NextResponse<ApiResult<{ received: true }>>> {
  // 1. Same-origin protection
  if (!validateSameOrigin(request)) {
    return NextResponse.json<ApiResult<{ received: true }>>(
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

  // 2. Persistent / memory sliding-window rate limit
  const rateLimitResult = await checkContactRateLimit(request);
  if (!rateLimitResult.allowed) {
    const headers: Record<string, string> = { "Cache-Control": "no-store" };
    if (rateLimitResult.retryAfter !== undefined) {
      headers["Retry-After"] = String(rateLimitResult.retryAfter);
    }
    return NextResponse.json<ApiResult<{ received: true }>>(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many contact submissions. Please wait before retrying.",
        },
      },
      {
        status: 429,
        headers,
      }
    );
  }

  // 3. Read bounded JSON body (16 KiB limit, validates Content-Type and JSON syntax)
  const bodyResult = await readBoundedJson(request);
  if (!bodyResult.ok) {
    return NextResponse.json<ApiResult<{ received: true }>>(
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

  // 4. Server-side validation of fields against shared contract
  const validation = validateContactInput(bodyResult.data);
  if (!validation.ok) {
    return NextResponse.json<ApiResult<{ received: true }>>(
      {
        success: false,
        error: {
          code: validation.code,
          message: validation.message,
          fieldErrors: validation.fieldErrors,
        },
      },
      {
        status: validation.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 5. Persist to database using server-only privileged access
  const persistResult = await insertContactMessage(validation.data);
  if (!persistResult.ok || !persistResult.data) {
    return NextResponse.json<ApiResult<{ received: true }>>(
      {
        success: false,
        error: {
          code: persistResult.code || "PERSISTENCE_FAILED",
          message: persistResult.message || "Failed to persist contact message.",
        },
      },
      {
        status: persistResult.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // 6. Asynchronous email notification adapter (isolated from persistence)
  // Failures in notification NEVER affect visitor response or stored row.
  await sendContactEmailNotification(persistResult.data);

  // 7. Return HTTP 201 only after confirmed persistence
  return NextResponse.json<ApiResult<{ received: true }>>(
    {
      success: true,
      data: { received: true },
    },
    {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
