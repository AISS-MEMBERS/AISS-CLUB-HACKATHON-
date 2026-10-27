/**
 * Admin API Client Helpers
 * Strictly handles frozen contracts and standard HTTP response codes (400, 401, 403, 404, 409, 503).
 * No localStorage caching, no private token storage.
 */

import {
  ApiResult,
  ClubEvent,
  ContactMessage,
  EventWriteInput,
  MessageStatus,
  PaginatedList,
} from "./types";

export class AdminApiError extends Error {
  public code: string;
  public status: number;
  public fieldErrors?: Record<string, string>;

  constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

async function requestJson<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
      cache: "no-store",
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const json = isJson ? await response.json() : null;

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Oturum süreniz dolmuş veya giriş yapmamışsınız. Lütfen tekrar giriş yapın.",
          },
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Bu işlem için yönetici yetkiniz bulunmuyor.",
          },
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "İstenen kaynak bulunamadı (404).",
          },
        };
      }

      if (response.status === 409) {
        return {
          success: false,
          error: {
            code: "CONFLICT",
            message:
              json?.error?.message ||
              "Çakışma: Aynı anda yalnızca bir etkinlik hem 'yayınlanmış' hem de 'öne çıkarılmış' olabilir.",
          },
        };
      }

      if (response.status === 503) {
        return {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Veritabanı veya arka uç servisi şu an kullanılamıyor (503).",
          },
        };
      }

      if (json && typeof json === "object" && "error" in json) {
        return json as ApiResult<T>;
      }

      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: `Sunucu hatası: HTTP ${response.status}`,
        },
      };
    }

    return json as ApiResult<T>;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ağ bağlantı hatası oluştu.";
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: `Bağlantı kurulamadı: ${message}. API sunucusuna erişilemiyor.`,
      },
    };
  }
}

/**
 * Events API Client
 */
export async function fetchAdminEvents(page: number = 1): Promise<ApiResult<PaginatedList<ClubEvent>>> {
  return requestJson<PaginatedList<ClubEvent>>(`/api/admin/events?page=${encodeURIComponent(page)}`);
}

export async function createAdminEvent(input: EventWriteInput): Promise<ApiResult<ClubEvent>> {
  return requestJson<ClubEvent>("/api/admin/events", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminEvent(
  id: string,
  input: Partial<EventWriteInput>
): Promise<ApiResult<ClubEvent>> {
  return requestJson<ClubEvent>(`/api/admin/events/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

/**
 * Messages API Client
 */
export async function fetchAdminMessages(
  page: number = 1
): Promise<ApiResult<PaginatedList<ContactMessage>>> {
  return requestJson<PaginatedList<ContactMessage>>(
    `/api/admin/messages?page=${encodeURIComponent(page)}`
  );
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<ApiResult<ContactMessage>> {
  return requestJson<ContactMessage>(`/api/admin/messages/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/**
 * Auth Logout Helper
 * Calls POST /api/auth/logout without storing any auth state in localStorage
 */
export async function performLogout(): Promise<ApiResult<{ signedOut: boolean }>> {
  return requestJson<{ signedOut: boolean }>("/api/auth/logout", {
    method: "POST",
  });
}
