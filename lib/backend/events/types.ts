import type { EventWriteInput, ClubEvent } from "@/types/backend";
export type { ClubEvent, EventCategory, PublicationStatus, EventWriteInput, ApiResult } from "@/types/backend";
export type { EventRow } from "@/types/database";
export type EventPatchInput = Partial<EventWriteInput>;
export interface PaginatedEvents { items: ClubEvent[]; page: number }
