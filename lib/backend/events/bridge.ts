/**
 * Shared bridge for Events API.
 *
 * Implements the standard error envelopes, Origin checking, bounded body reader,
 * and dependency validation specified in docs/backend/ZEYNEP-EVENTS-BACKEND.md.
 *
 * NOTE: Once Selen's shared foundation (lib/backend/shared/ and lib/backend/auth/)
 * is merged by the lead, this file will delegate directly to those shared exports.
 */

import { NextResponse } from "next/server";
import { ApiResult } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Maps any caught error to a standard ApiResult error Response.
 * Never leaks raw database errors or stack traces to clients.
 */
export function createApiErrorResponse(error: unknown): NextResponse<ApiResult<never>> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
        },
      },
      {
        status: error.status,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

/**
 * Validates request Origin against configured APP_ORIGIN (or host).
 * Throws ApiError 403 on origin mismatch.
 */
export function verifySameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Non-browser or same-origin GET/requests without Origin header
    return;
  }

  const appOrigin = process.env.APP_ORIGIN;
  if (appOrigin) {
    if (origin !== appOrigin) {
      throw new ApiError(
        403,
        "FORBIDDEN_ORIGIN",
        "Cross-origin mutation request rejected."
      );
    }
    return;
  }

  // Fallback: compare origin host against request host header
  const host = request.headers.get("host");
  if (host) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        throw new ApiError(
          403,
          "FORBIDDEN_ORIGIN",
          "Cross-origin mutation request rejected."
        );
      }
    } catch {
      throw new ApiError(400, "BAD_ORIGIN", "Invalid Origin header.");
    }
  }
}

/**
 * Bounded JSON body reader. Rejects requests exceeding maxBytes (default 64 KiB).
 */
export async function parseJsonBody(
  request: Request,
  maxBytes: number = 65536
): Promise<unknown> {
  let text: string;
  try {
    text = await request.text();
  } catch {
    throw new ApiError(400, "BAD_REQUEST", "Failed to read request body.");
  }

  const byteLength = new TextEncoder().encode(text).length;
  if (byteLength > maxBytes) {
    throw new ApiError(
      413,
      "PAYLOAD_TOO_LARGE",
      `Request body exceeds maximum allowed size of ${maxBytes} bytes.`
    );
  }

  if (!text || text.trim().length === 0) {
    throw new ApiError(400, "EMPTY_BODY", "Request body cannot be empty.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body is not valid JSON.");
  }
}

/**
 * Checks admin authentication.
 *
 * In accordance with AGENTS.md and ZEYNEP-EVENTS-BACKEND.md:
 * - If Selen's shared auth guard (lib/backend/auth/require-admin) is available, calls it.
 * - If runtime database credentials are not configured, throws ApiError 503.
 * - Missing or invalid credentials never grant admin access.
 */
export async function requireAdminAuth(): Promise<{ userId: string }> {
  // Check if Supabase runtime is configured
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new ApiError(
      503,
      "DEPENDENCY_UNAVAILABLE",
      "Admin authentication service is unavailable. Missing runtime database configuration."
    );
  }

  // When Selen's requireAdmin module is integrated, call it
  try {
    // Dynamic import to avoid build-time failure when file is not yet merged
    const authModule = await import(
      /* webpackIgnore: true */ "@/lib/backend/auth/require-admin" as string
    ).catch(() => null);

    if (authModule && typeof authModule.requireAdmin === "function") {
      return await authModule.requireAdmin();
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, "UNAUTHORIZED", "Authentication failed.");
  }

  // If credentials are set but auth guard file is not yet merged by lead:
  throw new ApiError(
    503,
    "DEPENDENCY_UNAVAILABLE",
    "Shared requireAdmin module is pending integration by team lead."
  );
}
