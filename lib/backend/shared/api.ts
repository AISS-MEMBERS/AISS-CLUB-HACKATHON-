import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/backend";

/**
 * Standard API error class for all AISS backend route handlers.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Serializes any caught error into the frozen ApiResult error envelope.
 * Always ensures sensitive server details, stack traces, and database errors are sanitized.
 */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    const body: ApiResult<never> = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      },
    };

    return NextResponse.json(body, {
      status: error.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  // Fallback for unexpected internal errors
  const fallbackBody: ApiResult<never> = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    },
  };

  return NextResponse.json(fallbackBody, {
    status: 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
