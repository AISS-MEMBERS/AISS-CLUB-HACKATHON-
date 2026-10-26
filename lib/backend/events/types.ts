/**
 * Types for the Events module.
 *
 * NOTE: These types strictly align with the frozen contract in docs/backend/ZEYNEP-EVENTS-BACKEND.md.
 * Once Selen's shared foundation is merged and types/backend.ts is available,
 * these definitions should be replaced with imports from types/backend.ts.
 */

export type EventCategory = "WORKSHOP" | "TALK" | "BUILD SESSION";
export type PublicationStatus = "draft" | "published" | "archived";

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  lead: string | null;
  imagePath: string | null;
  publicationStatus: PublicationStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventWriteInput = Pick<
  ClubEvent,
  | "title"
  | "description"
  | "category"
  | "startsAt"
  | "endsAt"
  | "location"
  | "lead"
  | "imagePath"
  | "publicationStatus"
  | "isFeatured"
>;

export type EventPatchInput = Partial<EventWriteInput>;

/**
 * Raw database row shape from PostgreSQL public.events table.
 */
export interface EventRow {
  id: string;
  title: string;
  description: string;
  category: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  lead: string | null;
  image_path: string | null;
  publication_status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type ApiResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string>;
      };
    };

export interface PaginatedEvents {
  items: ClubEvent[];
  page: number;
}
