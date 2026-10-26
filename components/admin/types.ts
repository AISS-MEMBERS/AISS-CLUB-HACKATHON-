/**
 * AISS Club - Admin Dashboard Types
 * Frozen backend contracts according to docs/backend/NISA-ADMIN-DASHBOARD.md
 */

export type EventCategory = "WORKSHOP" | "TALK" | "BUILD SESSION";
export type PublicationStatus = "draft" | "published" | "archived";
export type MessageStatus = "new" | "read" | "archived";
export type Interest = "Machine Learning" | "Robotics" | "Joining the Team" | "General Inquiry";

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

export interface PaginatedList<T> {
  items: T[];
  page: number;
}

/**
 * Approved event images in /students/gizem/
 * Arbitrary upload or external URLs are prohibited by frozen contract.
 */
export const APPROVED_EVENT_IMAGES = [
  { label: "Görsel Yok (None)", value: "" },
  { label: "AI Ethics (/students/gizem/ai-ethics.jpg)", value: "/students/gizem/ai-ethics.jpg" },
  { label: "Computer Vision (/students/gizem/computer-vision.jpg)", value: "/students/gizem/computer-vision.jpg" },
  { label: "LLM Fine-tuning (/students/gizem/llm-finetuning.jpg)", value: "/students/gizem/llm-finetuning.jpg" },
  { label: "Transformer Architecture (/students/gizem/transformer-architecture.jpg)", value: "/students/gizem/transformer-architecture.jpg" },
] as const;
