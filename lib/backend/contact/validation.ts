// lib/backend/contact/validation.ts
// Pure server-side validation and request parsing for the contact module.

import { ContactInput, Interest, MessageStatus } from "./types";

export const ALLOWED_INTERESTS: readonly Interest[] = [
  "Machine Learning",
  "Robotics",
  "Joining the Team",
  "General Inquiry",
] as const;

export const ALLOWED_STATUSES: readonly MessageStatus[] = [
  "new",
  "read",
  "archived",
] as const;

export const MAX_BODY_BYTES = 16 * 1024; // 16 KiB

// RFC 5322-aligned standard email regex matching DB check constraint:
// university_email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Standard UUID regex (v4 or general 8-4-4-4-12 hex)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ValidationSuccess<T> {
  ok: true;
  data: T;
}

export interface ValidationFailure {
  ok: false;
  code: string;
  message: string;
  status: number;
  fieldErrors?: Record<string, string>;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Validates the raw parsed JSON payload for contact submission.
 * Enforces strict 4-field whitelist, character lengths, and allowed interest enum.
 */
export function validateContactInput(raw: unknown): ValidationResult<ContactInput> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_JSON_OBJECT",
      message: "Request body must be a JSON object.",
    };
  }

  const payload = raw as Record<string, unknown>;
  const allowedKeys = new Set(["fullName", "universityEmail", "areaOfInterest", "message"]);
  const extraKeys = Object.keys(payload).filter((k) => !allowedKeys.has(k));

  if (extraKeys.length > 0) {
    return {
      ok: false,
      status: 400,
      code: "UNEXPECTED_FIELDS",
      message: `Unexpected fields in payload: ${extraKeys.join(", ")}`,
      fieldErrors: Object.fromEntries(extraKeys.map((k) => [k, "Field is not allowed."])),
    };
  }

  const fieldErrors: Record<string, string> = {};

  // 1. fullName: 2-100 characters
  if (typeof payload.fullName !== "string") {
    fieldErrors.fullName = "Full name must be a string.";
  } else {
    const trimmed = payload.fullName.trim();
    if (trimmed.length < 2) {
      fieldErrors.fullName = "Full name must be at least 2 characters.";
    } else if (trimmed.length > 100) {
      fieldErrors.fullName = "Full name cannot exceed 100 characters.";
    }
  }

  // 2. universityEmail: valid email syntax, max 254 characters (no domain restriction)
  if (typeof payload.universityEmail !== "string") {
    fieldErrors.universityEmail = "University email must be a string.";
  } else {
    const trimmedEmail = payload.universityEmail.trim();
    if (trimmedEmail.length === 0) {
      fieldErrors.universityEmail = "Email address is required.";
    } else if (trimmedEmail.length > 254) {
      fieldErrors.universityEmail = "Email address cannot exceed 254 characters.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      fieldErrors.universityEmail = "Please enter a valid email address (e.g. name@university.edu).";
    }
  }

  // 3. areaOfInterest: allowed interests only
  if (typeof payload.areaOfInterest !== "string") {
    fieldErrors.areaOfInterest = "Area of interest must be selected.";
  } else if (!ALLOWED_INTERESTS.includes(payload.areaOfInterest as Interest)) {
    fieldErrors.areaOfInterest = `Allowed interests: ${ALLOWED_INTERESTS.join(", ")}.`;
  }

  // 4. message: 10-3000 characters
  if (typeof payload.message !== "string") {
    fieldErrors.message = "Message must be a string.";
  } else {
    const trimmedMessage = payload.message.trim();
    if (trimmedMessage.length < 10) {
      fieldErrors.message = "Message must be at least 10 characters.";
    } else if (trimmedMessage.length > 3000) {
      fieldErrors.message = "Message cannot exceed 3000 characters.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "One or more fields failed validation.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      fullName: (payload.fullName as string).trim(),
      universityEmail: (payload.universityEmail as string).trim(),
      areaOfInterest: payload.areaOfInterest as Interest,
      message: (payload.message as string).trim(),
    },
  };
}

/**
 * Validates PATCH /api/admin/messages/[id] payload.
 * Accepts only { status: MessageStatus }.
 */
export function validateStatusUpdate(raw: unknown): ValidationResult<{ status: MessageStatus }> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_JSON_OBJECT",
      message: "Request body must be a JSON object.",
    };
  }

  const payload = raw as Record<string, unknown>;
  const keys = Object.keys(payload);

  if (keys.length === 0 || !("status" in payload)) {
    return {
      ok: false,
      status: 400,
      code: "MISSING_STATUS",
      message: "Body must include 'status'.",
    };
  }

  const extraKeys = keys.filter((k) => k !== "status");
  if (extraKeys.length > 0) {
    return {
      ok: false,
      status: 400,
      code: "UNEXPECTED_FIELDS",
      message: `Only 'status' can be updated. Unexpected fields: ${extraKeys.join(", ")}`,
    };
  }

  if (typeof payload.status !== "string" || !ALLOWED_STATUSES.includes(payload.status as MessageStatus)) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_STATUS",
      message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}.`,
    };
  }

  return {
    ok: true,
    data: { status: payload.status as MessageStatus },
  };
}

/**
 * Validates pagination parameters: page starts at 1; limit defaults to 20, max 50.
 */
export function validatePagination(
  searchParams: URLSearchParams
): ValidationResult<{ page: number; limit: number }> {
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  let page = 1;
  let limit = 20;

  if (pageParam !== null) {
    const parsedPage = Number(pageParam);
    if (!Number.isSafeInteger(parsedPage) || parsedPage < 1 || parsedPage > 10000) {
      return {
        ok: false,
        status: 400,
        code: "INVALID_PAGINATION",
        message: "Query parameter 'page' must be a positive integer starting at 1.",
      };
    }
    page = parsedPage;
  }

  if (limitParam !== null) {
    const parsedLimit = Number(limitParam);
    if (!Number.isSafeInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return {
        ok: false,
        status: 400,
        code: "INVALID_PAGINATION",
        message: "Query parameter 'limit' must be an integer between 1 and 50.",
      };
    }
    limit = parsedLimit;
  }

  return {
    ok: true,
    data: { page, limit },
  };
}

/**
 * Validates UUID format for URL parameters.
 */
export function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Enforces same-origin verification against APP_ORIGIN or Host header.
 */
export function validateSameOrigin(request: Request): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    // If Origin is not sent (e.g. some same-origin GET/fetch), check referer or host
    const referer = request.headers.get("referer");
    if (!referer) return true; // Safe fallback for non-cross-site requests
    try {
      const refererUrl = new URL(referer);
      const host = request.headers.get("host");
      return refererUrl.host === host;
    } catch {
      return false;
    }
  }

  try {
    const originUrl = new URL(originHeader);
    const configuredAppOrigin = process.env.APP_ORIGIN;
    if (configuredAppOrigin) {
      try {
        const expected = new URL(configuredAppOrigin);
        return originUrl.origin === expected.origin;
      } catch {
        // Fallback to host check if configured origin is malformed
      }
    }

    const host = request.headers.get("host");
    return originUrl.host === host;
  } catch {
    return false;
  }
}

/**
 * Reads request body stream safely with an explicit 16 KiB byte bound.
 */
export async function readBoundedJson(
  request: Request,
  maxBytes: number = MAX_BODY_BYTES
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; code: string; message: string }> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_CONTENT_TYPE",
      message: "Content-Type must be application/json.",
    };
  }

  // Fast check: Content-Length if present and oversized
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    return {
      ok: false,
      status: 413,
      code: "PAYLOAD_TOO_LARGE",
      message: `Payload exceeds the maximum allowed size of ${maxBytes} bytes.`,
    };
  }

  if (!request.body) {
    return {
      ok: false,
      status: 400,
      code: "EMPTY_BODY",
      message: "Request body cannot be empty.",
    };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel("Payload too large");
          return {
            ok: false,
            status: 413,
            code: "PAYLOAD_TOO_LARGE",
            message: `Payload exceeds the maximum allowed size of ${maxBytes} bytes.`,
          };
        }
        chunks.push(value);
      }
    }
  } catch (err) {
    return {
      ok: false,
      status: 400,
      code: "BODY_READ_ERROR",
      message: err instanceof Error ? err.message : "Failed to read request body.",
    };
  }

  if (chunks.length === 0) {
    return {
      ok: false,
      status: 400,
      code: "EMPTY_BODY",
      message: "Request body cannot be empty.",
    };
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder("utf-8").decode(merged);
  try {
    const parsed = JSON.parse(text);
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      status: 400,
      code: "INVALID_JSON",
      message: "Malformed JSON payload.",
    };
  }
}
