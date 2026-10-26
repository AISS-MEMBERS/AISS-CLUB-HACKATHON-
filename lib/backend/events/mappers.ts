import {
  ClubEvent,
  EventCategory,
  EventPatchInput,
  EventRow,
  EventWriteInput,
  PublicationStatus,
} from "./types";

/**
 * Maps a PostgreSQL snake_case public.events row to a ClubEvent DTO.
 */
export function mapRowToClubEvent(row: EventRow): ClubEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as EventCategory,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? null,
    location: row.location ?? null,
    lead: row.lead ?? null,
    imagePath: row.image_path ?? null,
    publicationStatus: row.publication_status as PublicationStatus,
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps an EventWriteInput DTO to a snake_case row payload for SQL insertion.
 */
export function mapWriteInputToRow(
  input: EventWriteInput
): Omit<EventRow, "id" | "created_at" | "updated_at"> {
  return {
    title: input.title,
    description: input.description,
    category: input.category,
    starts_at: input.startsAt,
    ends_at: input.endsAt ?? null,
    location: input.location ?? null,
    lead: input.lead ?? null,
    image_path: input.imagePath ?? null,
    publication_status: input.publicationStatus,
    is_featured: input.isFeatured,
  };
}

/**
 * Maps partial EventPatchInput fields to snake_case column updates.
 */
export function mapPatchInputToRow(
  input: EventPatchInput
): Partial<Omit<EventRow, "id" | "created_at" | "updated_at">> {
  const rowPatch: Partial<Omit<EventRow, "id" | "created_at" | "updated_at">> =
    {};

  if (input.title !== undefined) rowPatch.title = input.title;
  if (input.description !== undefined) rowPatch.description = input.description;
  if (input.category !== undefined) rowPatch.category = input.category;
  if (input.startsAt !== undefined) rowPatch.starts_at = input.startsAt;
  if (input.endsAt !== undefined) rowPatch.ends_at = input.endsAt;
  if (input.location !== undefined) rowPatch.location = input.location;
  if (input.lead !== undefined) rowPatch.lead = input.lead;
  if (input.imagePath !== undefined) rowPatch.image_path = input.imagePath;
  if (input.publicationStatus !== undefined)
    rowPatch.publication_status = input.publicationStatus;
  if (input.isFeatured !== undefined) rowPatch.is_featured = input.isFeatured;

  return rowPatch;
}

/**
 * Formats an ISO datetime string for display in Europe/Istanbul timezone.
 * Returns month abbreviation in uppercase and day (e.g. "OCT 28").
 */
export function formatDisplayDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      timeZone: "Europe/Istanbul",
    });

    // "Oct 28" -> "OCT 28"
    const formatted = formatter.format(date);
    return formatted.toUpperCase();
  } catch {
    return isoString;
  }
}

/**
 * Formats event start and optional end times in 24-hour format (Europe/Istanbul timezone).
 * Example: "18:00 – 20:00" or "18:00".
 */
export function formatDisplayTime(
  startsAt: string,
  endsAt?: string | null
): string | undefined {
  try {
    const startDate = new Date(startsAt);
    if (isNaN(startDate.getTime())) return undefined;

    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Istanbul",
    });

    const startTime = timeFormatter.format(startDate);

    if (endsAt) {
      const endDate = new Date(endsAt);
      if (!isNaN(endDate.getTime())) {
        const endTime = timeFormatter.format(endDate);
        return `${startTime} – ${endTime}`;
      }
    }

    return startTime;
  } catch {
    return undefined;
  }
}

/**
 * Computes whether an event is "upcoming" or "past" based on its timestamp relative to now.
 * NOTE: As per AGENTS.md / ZEYNEP-EVENTS-BACKEND.md, upcoming/past is computed from
 * startsAt (or endsAt if specified), and must never be confused with draft/published/archived.
 */
export function computeEventStatus(
  startsAt: string,
  endsAt?: string | null,
  referenceNow: Date = new Date()
): "upcoming" | "past" {
  try {
    const expiryTimestamp = endsAt
      ? new Date(endsAt).getTime()
      : new Date(startsAt).getTime();

    if (isNaN(expiryTimestamp)) return "upcoming";
    return referenceNow.getTime() >= expiryTimestamp ? "past" : "upcoming";
  } catch {
    return "upcoming";
  }
}
