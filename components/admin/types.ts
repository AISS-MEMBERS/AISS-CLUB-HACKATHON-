export type { ClubEvent, ContactInput, ContactMessage, EventCategory, EventWriteInput,
  PublicationStatus, MessageStatus, Interest, ApiResult } from "@/types/backend";
export type { PaginatedResult as PaginatedList } from "@/types/backend";

/**
 * Approved event images in /students/gizem/
 * Custom covers use the authenticated upload endpoint; arbitrary remote URLs remain disallowed.
 */
export const APPROVED_EVENT_IMAGES = [
  { label: "Görsel Yok (None)", value: "" },
  { label: "AI Ethics (/students/gizem/ai-ethics.jpg)", value: "/students/gizem/ai-ethics.jpg" },
  { label: "Computer Vision (/students/gizem/computer-vision.jpg)", value: "/students/gizem/computer-vision.jpg" },
  { label: "LLM Fine-tuning (/students/gizem/llm-finetuning.jpg)", value: "/students/gizem/llm-finetuning.jpg" },
  { label: "Transformer Architecture (/students/gizem/transformer-architecture.jpg)", value: "/students/gizem/transformer-architecture.jpg" },
] as const;
