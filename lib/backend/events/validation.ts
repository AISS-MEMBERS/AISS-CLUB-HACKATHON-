import { coverObjectName } from "@/lib/event-covers";
import {
  EventCategory,
  EventPatchInput,
  EventWriteInput,
  PublicationStatus,
} from "./types";

export const ALLOWED_EVENT_IMAGES = [
  "/students/gizem/ai-ethics.jpg",
  "/students/gizem/computer-vision.jpg",
  "/students/gizem/llm-finetuning.jpg",
  "/students/gizem/transformer-architecture.jpg",
] as const;

export type AllowedEventImage = (typeof ALLOWED_EVENT_IMAGES)[number];

export const ALLOWED_CATEGORIES: readonly EventCategory[] = [
  "WORKSHOP",
  "TALK",
  "BUILD SESSION",
] as const;

export const ALLOWED_PUBLICATION_STATUSES: readonly PublicationStatus[] = [
  "draft",
  "published",
  "archived",
] as const;

export const ALLOWED_EVENT_WRITE_FIELDS = [
  "title",
  "description",
  "category",
  "startsAt",
  "endsAt",
  "location",
  "lead",
  "imagePath",
  "publicationStatus",
  "isFeatured",
] as const;

export interface ValidationSuccess<T> {
  valid: true;
  data: T;
}

export interface ValidationFailure {
  valid: false;
  fieldErrors: Record<string, string>;
  message: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Verifies standard UUID format (v1-v5).
 */
export function isValidUuid(id: string): boolean {
  if (typeof id !== "string") return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Verifies complete ISO 8601 date string with UTC 'Z' or explicit timezone offset.
 */
export function isValidIsoDateTime(val: string): boolean {
  if (typeof val !== "string") return false;
  const isoWithTimezoneRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;
  if (!isoWithTimezoneRegex.test(val)) {
    return false;
  }
  const date = new Date(val);
  return !isNaN(date.getTime());
}

/**
 * Validates pagination query parameters for event lists.
 * Default page: 1. Default limit: 20. Max limit: 50.
 */
export function validatePagination(
  pageParam: string | null,
  limitParam: string | null
): ValidationResult<{ page: number; limit: number }> {
  const fieldErrors: Record<string, string> = {};

  let page = 1;
  if (pageParam !== null && pageParam !== undefined) {
    if (!/^\d+$/.test(pageParam)) {
      fieldErrors.page = "Page must be a positive integer.";
    } else {
      const parsed = parseInt(pageParam, 10);
      if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 10000) {
        fieldErrors.page = "Page must be greater than or equal to 1.";
      } else {
        page = parsed;
      }
    }
  }

  let limit = 20;
  if (limitParam !== null && limitParam !== undefined) {
    if (!/^\d+$/.test(limitParam)) {
      fieldErrors.limit = "Limit must be a positive integer.";
    } else {
      const parsed = parseInt(limitParam, 10);
      if (!Number.isSafeInteger(parsed) || parsed < 1) {
        fieldErrors.limit = "Limit must be at least 1.";
      } else if (parsed > 50) {
        fieldErrors.limit = "Limit cannot exceed 50.";
      } else {
        limit = parsed;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      fieldErrors,
      message: "Invalid pagination parameters.",
    };
  }

  return { valid: true, data: { page, limit } };
}

/**
 * Validates payload for creating a new event (EventWriteInput).
 * Rejects unexpected/forbidden fields (like id, createdAt, role).
 */
export function validateEventWriteInput(
  raw: unknown
): ValidationResult<EventWriteInput> {
  const fieldErrors: Record<string, string> = {};

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      valid: false,
      fieldErrors: { body: "Request body must be a JSON object." },
      message: "Invalid JSON body.",
    };
  }

  const record = raw as Record<string, unknown>;

  // Check for unexpected or forbidden fields
  const allowedKeys = new Set<string>(ALLOWED_EVENT_WRITE_FIELDS);
  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) {
      fieldErrors[key] = `Unexpected or immutable field '${key}' is not allowed.`;
    }
  }

  // title: trimmed length 3 to 160
  if (typeof record.title !== "string") {
    fieldErrors.title = "Title is required and must be a string.";
  } else {
    const trimmed = record.title.trim();
    if (trimmed.length < 3 || trimmed.length > 160) {
      fieldErrors.title = "Title must be between 3 and 160 characters.";
    }
  }

  // description: trimmed length 10 to 3000
  if (typeof record.description !== "string") {
    fieldErrors.description = "Description is required and must be a string.";
  } else {
    const trimmed = record.description.trim();
    if (trimmed.length < 10 || trimmed.length > 3000) {
      fieldErrors.description =
        "Description must be between 10 and 3000 characters.";
    }
  }

  // category: "WORKSHOP" | "TALK" | "BUILD SESSION"
  if (
    typeof record.category !== "string" ||
    !ALLOWED_CATEGORIES.includes(record.category as EventCategory)
  ) {
    fieldErrors.category = `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`;
  }

  // publicationStatus: "draft" | "published" | "archived"
  if (
    typeof record.publicationStatus !== "string" ||
    !ALLOWED_PUBLICATION_STATUSES.includes(
      record.publicationStatus as PublicationStatus
    )
  ) {
    fieldErrors.publicationStatus = `Publication status must be one of: ${ALLOWED_PUBLICATION_STATUSES.join(", ")}.`;
  }

  // isFeatured: boolean
  if (typeof record.isFeatured !== "boolean") {
    fieldErrors.isFeatured = "isFeatured must be a boolean.";
  }

  // startsAt: ISO 8601 with timezone
  let validStartsAt = false;
  if (typeof record.startsAt !== "string") {
    fieldErrors.startsAt = "startsAt is required and must be an ISO 8601 string.";
  } else if (!isValidIsoDateTime(record.startsAt)) {
    fieldErrors.startsAt =
      "startsAt must be a valid ISO 8601 datetime string with UTC (Z) or explicit offset.";
  } else {
    validStartsAt = true;
  }

  // endsAt: null or ISO 8601 string, must be after startsAt
  if (record.endsAt !== null && record.endsAt !== undefined) {
    if (typeof record.endsAt !== "string") {
      fieldErrors.endsAt = "endsAt must be an ISO 8601 string or null.";
    } else if (!isValidIsoDateTime(record.endsAt)) {
      fieldErrors.endsAt =
        "endsAt must be a valid ISO 8601 datetime string with UTC (Z) or explicit offset.";
    } else if (
      validStartsAt &&
      new Date(record.endsAt).getTime() <=
        new Date(record.startsAt as string).getTime()
    ) {
      fieldErrors.endsAt = "endsAt must be after startsAt.";
    }
  }

  // location: null or string <= 200
  if (record.location !== null && record.location !== undefined) {
    if (typeof record.location !== "string") {
      fieldErrors.location = "Location must be a string or null.";
    } else if (record.location.length > 200) {
      fieldErrors.location = "Location cannot exceed 200 characters.";
    }
  }

  // lead: null or string <= 200
  if (record.lead !== null && record.lead !== undefined) {
    if (typeof record.lead !== "string") {
      fieldErrors.lead = "Lead must be a string or null.";
    } else if (record.lead.length > 200) {
      fieldErrors.lead = "Lead cannot exceed 200 characters.";
    }
  }

  // imagePath: null or allowlisted existing image
  if (record.imagePath !== null && record.imagePath !== undefined) {
    if (typeof record.imagePath !== "string") {
      fieldErrors.imagePath = "imagePath must be a string or null.";
    } else if (
      !ALLOWED_EVENT_IMAGES.includes(record.imagePath as AllowedEventImage) &&
      !coverObjectName(record.imagePath)
    ) {
      fieldErrors.imagePath = `Choose a suggested image or upload a cover from your device.`;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      fieldErrors,
      message: "Event validation failed.",
    };
  }

  return {
    valid: true,
    data: {
      title: (record.title as string).trim(),
      description: (record.description as string).trim(),
      category: record.category as EventCategory,
      startsAt: record.startsAt as string,
      endsAt: (record.endsAt as string | null) ?? null,
      location: (record.location as string | null) ?? null,
      lead: (record.lead as string | null) ?? null,
      imagePath: (record.imagePath as string | null) ?? null,
      publicationStatus: record.publicationStatus as PublicationStatus,
      isFeatured: record.isFeatured as boolean,
    },
  };
}

/**
 * Validates payload for updating an event (PATCH).
 * Accepts partial fields, rejects if no allowed field is supplied or if unexpected keys are present.
 */
export function validateEventPatchInput(
  raw: unknown
): ValidationResult<EventPatchInput> {
  const fieldErrors: Record<string, string> = {};

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      valid: false,
      fieldErrors: { body: "Request body must be a JSON object." },
      message: "Invalid JSON body.",
    };
  }

  const record = raw as Record<string, unknown>;
  const allowedKeys = new Set<string>(ALLOWED_EVENT_WRITE_FIELDS);

  let allowedFieldCount = 0;
  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) {
      fieldErrors[key] = `Unexpected or immutable field '${key}' is not allowed in PATCH.`;
    } else {
      allowedFieldCount++;
    }
  }

  if (allowedFieldCount === 0 && Object.keys(fieldErrors).length === 0) {
    return {
      valid: false,
      fieldErrors: {
        body: "PATCH request must include at least one valid mutable field.",
      },
      message: "At least one mutable field must be provided.",
    };
  }

  const cleanedData: EventPatchInput = {};

  if ("title" in record) {
    if (typeof record.title !== "string") {
      fieldErrors.title = "Title must be a string.";
    } else {
      const trimmed = record.title.trim();
      if (trimmed.length < 3 || trimmed.length > 160) {
        fieldErrors.title = "Title must be between 3 and 160 characters.";
      } else {
        cleanedData.title = trimmed;
      }
    }
  }

  if ("description" in record) {
    if (typeof record.description !== "string") {
      fieldErrors.description = "Description must be a string.";
    } else {
      const trimmed = record.description.trim();
      if (trimmed.length < 10 || trimmed.length > 3000) {
        fieldErrors.description =
          "Description must be between 10 and 3000 characters.";
      } else {
        cleanedData.description = trimmed;
      }
    }
  }

  if ("category" in record) {
    if (
      typeof record.category !== "string" ||
      !ALLOWED_CATEGORIES.includes(record.category as EventCategory)
    ) {
      fieldErrors.category = `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`;
    } else {
      cleanedData.category = record.category as EventCategory;
    }
  }

  if ("publicationStatus" in record) {
    if (
      typeof record.publicationStatus !== "string" ||
      !ALLOWED_PUBLICATION_STATUSES.includes(
        record.publicationStatus as PublicationStatus
      )
    ) {
      fieldErrors.publicationStatus = `Publication status must be one of: ${ALLOWED_PUBLICATION_STATUSES.join(", ")}.`;
    } else {
      cleanedData.publicationStatus = record.publicationStatus as PublicationStatus;
    }
  }

  if ("isFeatured" in record) {
    if (typeof record.isFeatured !== "boolean") {
      fieldErrors.isFeatured = "isFeatured must be a boolean.";
    } else {
      cleanedData.isFeatured = record.isFeatured;
    }
  }

  if ("startsAt" in record) {
    if (typeof record.startsAt !== "string") {
      fieldErrors.startsAt = "startsAt must be an ISO 8601 string.";
    } else if (!isValidIsoDateTime(record.startsAt)) {
      fieldErrors.startsAt =
        "startsAt must be a valid ISO 8601 datetime string with UTC (Z) or explicit offset.";
    } else {
      cleanedData.startsAt = record.startsAt;
    }
  }

  if ("endsAt" in record) {
    if (record.endsAt === null) {
      cleanedData.endsAt = null;
    } else if (typeof record.endsAt !== "string") {
      fieldErrors.endsAt = "endsAt must be an ISO 8601 string or null.";
    } else if (!isValidIsoDateTime(record.endsAt)) {
      fieldErrors.endsAt =
        "endsAt must be a valid ISO 8601 datetime string with UTC (Z) or explicit offset.";
    } else {
      cleanedData.endsAt = record.endsAt;
    }
  }

  // Cross-field validation if both startsAt and endsAt are passed in the same patch
  if (
    cleanedData.startsAt &&
    cleanedData.endsAt &&
    new Date(cleanedData.endsAt).getTime() <=
      new Date(cleanedData.startsAt).getTime()
  ) {
    fieldErrors.endsAt = "endsAt must be after startsAt.";
  }

  if ("location" in record) {
    if (record.location === null) {
      cleanedData.location = null;
    } else if (typeof record.location !== "string") {
      fieldErrors.location = "Location must be a string or null.";
    } else if (record.location.length > 200) {
      fieldErrors.location = "Location cannot exceed 200 characters.";
    } else {
      cleanedData.location = record.location;
    }
  }

  if ("lead" in record) {
    if (record.lead === null) {
      cleanedData.lead = null;
    } else if (typeof record.lead !== "string") {
      fieldErrors.lead = "Lead must be a string or null.";
    } else if (record.lead.length > 200) {
      fieldErrors.lead = "Lead cannot exceed 200 characters.";
    } else {
      cleanedData.lead = record.lead;
    }
  }

  if ("imagePath" in record) {
    if (record.imagePath === null) {
      cleanedData.imagePath = null;
    } else if (typeof record.imagePath !== "string") {
      fieldErrors.imagePath = "imagePath must be a string or null.";
    } else if (
      !ALLOWED_EVENT_IMAGES.includes(record.imagePath as AllowedEventImage) &&
      !coverObjectName(record.imagePath)
    ) {
      fieldErrors.imagePath = `Choose a suggested image or upload a cover from your device.`;
    } else {
      cleanedData.imagePath = record.imagePath;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      fieldErrors,
      message: "Event patch validation failed.",
    };
  }

  return { valid: true, data: cleanedData };
}
