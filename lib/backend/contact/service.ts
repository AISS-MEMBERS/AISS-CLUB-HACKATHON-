// lib/backend/contact/service.ts
// Database persistence service for contact messages.
// Enforces privileged client for contact insertion and user-scoped client for admin queries.

import { ContactInput, ContactMessage, MessageStatus } from "./types";

interface DbContactMessageRow {
  id: string;
  full_name: string;
  university_email: string;
  area_of_interest: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

function mapRowToMessage(row: DbContactMessageRow): ContactMessage {
  return {
    id: row.id,
    fullName: row.full_name,
    universityEmail: row.university_email,
    areaOfInterest: row.area_of_interest as ContactMessage["areaOfInterest"],
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

function getSupabaseConfig(): { url: string; secretKey?: string; publishableKey?: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return { url, secretKey, publishableKey };
}

export interface PersistenceResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  code?: string;
  message?: string;
}

/**
 * Inserts a validated contact message using privileged server access.
 * Never runs on client, never exposes secret key.
 */
export async function insertContactMessage(
  input: ContactInput
): Promise<PersistenceResult<ContactMessage>> {
  const { url, secretKey } = getSupabaseConfig();

  if (!url || !secretKey) {
    return {
      ok: false,
      status: 503,
      code: "SERVICE_UNAVAILABLE",
      message: "Database service is not configured or unavailable.",
    };
  }

  const payload = {
    full_name: input.fullName,
    university_email: input.universityEmail,
    area_of_interest: input.areaOfInterest,
    message: input.message,
    status: "new",
  };

  try {
    const endpoint = `${url.replace(/\/$/, "")}/rest/v1/contact_messages`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "apikey": secretKey,
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      await response.text();
      return {
        ok: false,
        status: response.status >= 500 ? 503 : response.status,
        code: "DATABASE_INSERT_FAILED",
        message: "Failed to persist contact message to database.",
      };
    }

    const rows: DbContactMessageRow[] = await response.json();
    if (!rows || rows.length === 0) {
      return {
        ok: false,
        status: 500,
        code: "NO_ROW_RETURNED",
        message: "Message was inserted but no record was returned.",
      };
    }

    return {
      ok: true,
      status: 201,
      data: mapRowToMessage(rows[0]),
    };
  } catch (err) {
    return {
      ok: false,
      status: 503,
      code: "DATABASE_UNAVAILABLE",
      message: err instanceof Error ? err.message : "Database connection failed.",
    };
  }
}

/**
 * Helper to extract the user's access token from Authorization header or cookies.
 */
export function extractUserToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  // Check cookies for Supabase auth token
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    // Look for sb-<ref>-auth-token or access_token
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );

    for (const [key, val] of Object.entries(cookies)) {
      if (key.includes("auth-token") || key === "sb_access_token") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && parsed[0]) return parsed[0];
          if (parsed.access_token) return parsed.access_token;
        } catch {
          if (val) return val;
        }
      }
    }
  }

  return null;
}

/**
 * Checks whether the authenticated user is listed in admin_users.
 */
export async function verifyAdminUser(
  token: string,
  supabaseUrl: string,
  publishableKey: string
): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    // 1. Get authenticated user from Supabase Auth
    const userRes = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      return { isAdmin: false };
    }

    const userData = await userRes.json();
    const userId = userData.id;
    if (!userId) return { isAdmin: false };

    // 2. Query admin_users with user's token (RLS: select permitted if user_id = auth.uid())
    const adminCheckRes = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/admin_users?user_id=eq.${userId}`,
      {
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!adminCheckRes.ok) return { isAdmin: false, userId };

    const adminRows = await adminCheckRes.json();
    return { isAdmin: Array.isArray(adminRows) && adminRows.length > 0, userId };
  } catch {
    return { isAdmin: false };
  }
}

/**
 * Fetches paginated contact messages using user-scoped client and RLS.
 */
export async function listAdminMessages(
  request: Request,
  page: number,
  limit: number
): Promise<PersistenceResult<{ items: ContactMessage[]; page: number }>> {
  const token = extractUserToken(request);
  if (!token) {
    return {
      ok: false,
      status: 401,
      code: "UNAUTHENTICATED",
      message: "Authentication is required to access admin messages.",
    };
  }

  const { url, publishableKey } = getSupabaseConfig();
  if (!url || !publishableKey) {
    return {
      ok: false,
      status: 503,
      code: "SERVICE_UNAVAILABLE",
      message: "Database service is not configured or unavailable.",
    };
  }

  const { isAdmin } = await verifyAdminUser(token, url, publishableKey);
  if (!isAdmin) {
    return {
      ok: false,
      status: 403,
      code: "FORBIDDEN",
      message: "Admin privileges are required to view messages.",
    };
  }

  const offset = (page - 1) * limit;
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/contact_messages?select=*&order=created_at.desc,id.desc&limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        ok: false,
        status: res.status === 403 ? 403 : 500,
        code: "QUERY_FAILED",
        message: "Failed to fetch messages from database.",
      };
    }

    const rows: DbContactMessageRow[] = await res.json();
    return {
      ok: true,
      status: 200,
      data: {
        items: rows.map(mapRowToMessage),
        page,
      },
    };
  } catch (err) {
    return {
      ok: false,
      status: 503,
      code: "DATABASE_UNAVAILABLE",
      message: err instanceof Error ? err.message : "Database connection failed.",
    };
  }
}

/**
 * Updates a contact message status using user-scoped client and RLS.
 */
export async function updateAdminMessageStatus(
  request: Request,
  id: string,
  status: MessageStatus
): Promise<PersistenceResult<ContactMessage>> {
  const token = extractUserToken(request);
  if (!token) {
    return {
      ok: false,
      status: 401,
      code: "UNAUTHENTICATED",
      message: "Authentication is required to update messages.",
    };
  }

  const { url, publishableKey } = getSupabaseConfig();
  if (!url || !publishableKey) {
    return {
      ok: false,
      status: 503,
      code: "SERVICE_UNAVAILABLE",
      message: "Database service is not configured or unavailable.",
    };
  }

  const { isAdmin } = await verifyAdminUser(token, url, publishableKey);
  if (!isAdmin) {
    return {
      ok: false,
      status: 403,
      code: "FORBIDDEN",
      message: "Admin privileges are required to update messages.",
    };
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/contact_messages?id=eq.${id}`;

  try {
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      return {
        ok: false,
        status: res.status === 404 ? 404 : 500,
        code: "UPDATE_FAILED",
        message: "Failed to update message status in database.",
      };
    }

    const rows: DbContactMessageRow[] = await res.json();
    if (!rows || rows.length === 0) {
      return {
        ok: false,
        status: 404,
        code: "RECORD_NOT_FOUND",
        message: `Message with ID '${id}' was not found.`,
      };
    }

    return {
      ok: true,
      status: 200,
      data: mapRowToMessage(rows[0]),
    };
  } catch (err) {
    return {
      ok: false,
      status: 503,
      code: "DATABASE_UNAVAILABLE",
      message: err instanceof Error ? err.message : "Database connection failed.",
    };
  }
}
