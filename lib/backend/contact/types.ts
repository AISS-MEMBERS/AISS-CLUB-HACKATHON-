// lib/backend/contact/types.ts
// Shared contract types owned for the contact module.
// Aligned with the frozen backend contract in docs/backend/YAGMUR-CONTACT-BACKEND.md.

export type MessageStatus = "new" | "read" | "archived";

export type Interest =
  | "Machine Learning"
  | "Robotics"
  | "Joining the Team"
  | "General Inquiry";

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
