import "server-only";
import type { ContactInput, ContactMessage, MessageStatus } from "./types";
import { toContactMessage } from "@/types/backend";
import { ApiError } from "@/lib/backend/shared/api";
import { requireAdmin } from "@/lib/backend/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPrivilegedSupabaseClient } from "@/lib/supabase/privileged";

export interface PersistenceResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  code?: string;
  message?: string;
}
function failed<T>(error: unknown): PersistenceResult<T> {
  if (error instanceof ApiError) {
    return { ok: false, status: error.status, code: error.code, message: error.message };
  }
  return { ok: false, status: 503, code: "DATABASE_UNAVAILABLE", message: "The database is unavailable." };
}
export async function insertContactMessage(input: ContactInput): Promise<PersistenceResult<ContactMessage>> {
  try {
    const client = createPrivilegedSupabaseClient();
    const { data, error } = await client.from("contact_messages").insert({
      full_name: input.fullName, university_email: input.universityEmail,
      area_of_interest: input.areaOfInterest, message: input.message, status: "new",
    }).select("*").single();
    if (error || !data) throw new ApiError(503, "DATABASE_UNAVAILABLE", "Unable to save the message.");
    return { ok: true, status: 201, data: toContactMessage(data) };
  } catch (error) { return failed(error); }
}

export async function listAdminMessages(
  _request: Request, page: number, limit: number
): Promise<PersistenceResult<{ items: ContactMessage[]; page: number }>> {
  try {
    await requireAdmin();
    const client = await createServerSupabaseClient();
    const { data, error } = await client.from("contact_messages").select("*")
      .order("created_at", { ascending: false }).order("id", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);
    if (error) throw new ApiError(503, "DATABASE_UNAVAILABLE", "Unable to load messages.");
    return { ok: true, status: 200, data: { items: (data ?? []).map(toContactMessage), page } };
  } catch (error) { return failed(error); }
}

export async function updateAdminMessageStatus(
  _request: Request, id: string, status: MessageStatus
): Promise<PersistenceResult<ContactMessage>> {
  try {
    await requireAdmin();
    const client = await createServerSupabaseClient();
    const { data, error } = await client.from("contact_messages").update({ status })
      .eq("id", id).select("*").maybeSingle();
    if (error) throw new ApiError(503, "DATABASE_UNAVAILABLE", "Unable to update the message.");
    if (!data) throw new ApiError(404, "NOT_FOUND", "Message not found.");
    return { ok: true, status: 200, data: toContactMessage(data) };
  } catch (error) { return failed(error); }
}
