import type { EventRow, ContactMessageRow, TablesInsert } from "./database";

// --- Frozen Shared Contract from SELEN-BACKEND-FOUNDATION.md ---

export type EventCategory = "WORKSHOP" | "TALK" | "BUILD SESSION";
export type PublicationStatus = "draft" | "published" | "archived";
export type MessageStatus = "new" | "read" | "archived";
export type Interest =
  | "Machine Learning"
  | "Robotics"
  | "Joining the Team"
  | "General Inquiry";

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

export interface ContactInput {
  fullName: string;
  universityEmail: string;
  areaOfInterest: Interest;
  message: string;
}

export interface ContactMessage extends ContactInput {
  id: string;
  status: MessageStatus;
  createdAt: string;
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

// --- Additional shared constants and pagination types ---

export interface PaginatedResult<T> {
  items: T[];
  page: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  signedIn: boolean;
}

export interface LogoutResult {
  signedOut: boolean;
}

export const ALLOWED_EVENT_CATEGORIES: readonly EventCategory[] = [
  "WORKSHOP",
  "TALK",
  "BUILD SESSION",
] as const;

export const ALLOWED_PUBLICATION_STATUSES: readonly PublicationStatus[] = [
  "draft",
  "published",
  "archived",
] as const;

export const ALLOWED_MESSAGE_STATUSES: readonly MessageStatus[] = [
  "new",
  "read",
  "archived",
] as const;

export const ALLOWED_AREAS_OF_INTEREST: readonly Interest[] = [
  "Machine Learning",
  "Robotics",
  "Joining the Team",
  "General Inquiry",
] as const;

export const ALLOWED_EVENT_IMAGE_PATHS = [
  "/students/gizem/ai-ethics.jpg",
  "/students/gizem/computer-vision.jpg",
  "/students/gizem/llm-finetuning.jpg",
  "/students/gizem/transformer-architecture.jpg",
] as const;

export type AllowedEventImagePath = typeof ALLOWED_EVENT_IMAGE_PATHS[number];

// --- DTO Mapping Helpers ---

export function toClubEvent(row: EventRow): ClubEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    location: row.location,
    lead: row.lead,
    imagePath: row.image_path,
    publicationStatus: row.publication_status,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toContactMessage(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    fullName: row.full_name,
    universityEmail: row.university_email,
    areaOfInterest: row.area_of_interest,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function toEventInsert(input: EventWriteInput): TablesInsert<"events"> {
  return {
    title: input.title,
    description: input.description,
    category: input.category,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    location: input.location,
    lead: input.lead,
    image_path: input.imagePath,
    publication_status: input.publicationStatus,
    is_featured: input.isFeatured,
  };
}
