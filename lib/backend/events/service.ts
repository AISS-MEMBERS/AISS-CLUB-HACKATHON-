/**
 * Database service functions for the Events module.
 *
 * Implements published queries, admin queries, creation, partial updates,
 * deterministic ordering, bounded pagination, and single-featured invariants.
 */

import { ApiError } from "./bridge";
import { mapPatchInputToRow, mapRowToClubEvent, mapWriteInputToRow } from "./mappers";
import { ClubEvent, EventPatchInput, EventRow, EventWriteInput, PaginatedEvents } from "./types";

/**
 * Returns a user-scoped Supabase client or throws 503 if unconfigured.
 */
async function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new ApiError(
      503,
      "DEPENDENCY_UNAVAILABLE",
      "Database service is unavailable. Missing runtime database configuration."
    );
  }

  try {
    // Dynamic import of Selen's shared client to avoid build-time failure before merge
    const clientModule = await import(
      /* webpackIgnore: true */ "@/lib/supabase/server" as string
    ).catch(() => null);

    if (
      clientModule &&
      typeof clientModule.createServerSupabaseClient === "function"
    ) {
      return await clientModule.createServerSupabaseClient();
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      503,
      "DEPENDENCY_UNAVAILABLE",
      "Failed to initialize Supabase server client."
    );
  }

  throw new ApiError(
    503,
    "DEPENDENCY_UNAVAILABLE",
    "Shared createServerSupabaseClient module is pending integration by team lead."
  );
}

/**
 * Public: Fetches published events only, with deterministic ordering (startsAt asc, id asc)
 * and bounded pagination.
 */
export async function fetchPublishedEvents(params: {
  page: number;
  limit: number;
}): Promise<PaginatedEvents> {
  const { page, limit } = params;
  const client = await getSupabaseClient();

  const from = (page - 1) * limit;
  const to = page * limit - 1;

  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("publication_status", "published")
    .order("starts_at", { ascending: true })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    throw new ApiError(500, "DB_ERROR", "Failed to query published events.");
  }

  const items: ClubEvent[] = (data || []).map((row: EventRow) =>
    mapRowToClubEvent(row)
  );

  return { items, page };
}

/**
 * Admin: Fetches all events (drafts, published, archived), ordered by startsAt desc, id asc.
 */
export async function fetchAdminEvents(params: {
  page: number;
  limit: number;
}): Promise<PaginatedEvents> {
  const { page, limit } = params;
  const client = await getSupabaseClient();

  const from = (page - 1) * limit;
  const to = page * limit - 1;

  const { data, error } = await client
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    throw new ApiError(500, "DB_ERROR", "Failed to query admin events.");
  }

  const items: ClubEvent[] = (data || []).map((row: EventRow) =>
    mapRowToClubEvent(row)
  );

  return { items, page };
}

/**
 * Admin: Creates a new event record.
 * Enforces the at-most-one published featured invariant before inserting.
 */
export async function createAdminEvent(
  input: EventWriteInput
): Promise<ClubEvent> {
  const client = await getSupabaseClient();

  // Enforce at-most-one published featured invariant
  if (input.publicationStatus === "published" && input.isFeatured) {
    const { data: existingFeatured, error: checkError } = await client
      .from("events")
      .select("id")
      .eq("publication_status", "published")
      .eq("is_featured", true)
      .limit(1);

    if (checkError) {
      throw new ApiError(500, "DB_ERROR", "Failed to verify featured event status.");
    }

    if (existingFeatured && existingFeatured.length > 0) {
      throw new ApiError(
        409,
        "FEATURED_CONFLICT",
        "Another published event is already marked as featured. Unfeature it before featuring this event."
      );
    }
  }

  const rowPayload = mapWriteInputToRow(input);

  const { data, error } = await client
    .from("events")
    .insert([rowPayload])
    .select("*")
    .single();

  if (error) {
    // PostgreSQL unique constraint: events_one_published_featured_idx (code 23505)
    if (error.code === "23505") {
      throw new ApiError(
        409,
        "FEATURED_CONFLICT",
        "Another published event is already marked as featured."
      );
    }
    throw new ApiError(500, "DB_ERROR", "Failed to insert event.");
  }

  if (!data) {
    throw new ApiError(500, "DB_ERROR", "Event creation returned no data.");
  }

  return mapRowToClubEvent(data as EventRow);
}

/**
 * Admin: Updates an existing event record.
 * Handles partial updates, 404 for missing records, and 409 for featured conflicts.
 */
export async function updateAdminEvent(
  id: string,
  patch: EventPatchInput
): Promise<ClubEvent> {
  const client = await getSupabaseClient();

  // 1. Fetch current event to verify existence
  const { data: existing, error: fetchError } = await client
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new ApiError(404, "NOT_FOUND", `Event with ID '${id}' was not found.`);
  }

  const currentEvent = mapRowToClubEvent(existing as EventRow);

  // Cross-field validation: if only startsAt or endsAt is supplied in patch
  const finalStartsAt = patch.startsAt ?? currentEvent.startsAt;
  const finalEndsAt =
    patch.endsAt !== undefined ? patch.endsAt : currentEvent.endsAt;

  if (finalEndsAt !== null) {
    if (new Date(finalEndsAt).getTime() <= new Date(finalStartsAt).getTime()) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "endsAt must be after startsAt.",
        { endsAt: "endsAt must be after startsAt." }
      );
    }
  }

  // 2. Check featured conflict if updating to published & featured
  const willBePublished =
    (patch.publicationStatus ?? currentEvent.publicationStatus) === "published";
  const willBeFeatured =
    patch.isFeatured !== undefined ? patch.isFeatured : currentEvent.isFeatured;

  if (willBePublished && willBeFeatured) {
    const { data: otherFeatured, error: conflictError } = await client
      .from("events")
      .select("id")
      .eq("publication_status", "published")
      .eq("is_featured", true)
      .neq("id", id)
      .limit(1);

    if (conflictError) {
      throw new ApiError(500, "DB_ERROR", "Failed to check featured event conflict.");
    }

    if (otherFeatured && otherFeatured.length > 0) {
      throw new ApiError(
        409,
        "FEATURED_CONFLICT",
        "Another published event is already marked as featured. Unfeature it before featuring this event."
      );
    }
  }

  // 3. Map patch to row columns and update
  const rowPatch = mapPatchInputToRow(patch);

  const { data: updated, error: updateError } = await client
    .from("events")
    .update(rowPatch)
    .eq("id", id)
    .select("*")
    .single();

  if (updateError) {
    if (updateError.code === "23505") {
      throw new ApiError(
        409,
        "FEATURED_CONFLICT",
        "Another published event is already marked as featured."
      );
    }
    throw new ApiError(500, "DB_ERROR", "Failed to update event.");
  }

  if (!updated) {
    throw new ApiError(500, "DB_ERROR", "Event update returned no data.");
  }

  return mapRowToClubEvent(updated as EventRow);
}
