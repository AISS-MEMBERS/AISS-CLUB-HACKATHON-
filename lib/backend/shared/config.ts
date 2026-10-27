import "server-only";
import { ApiError } from "./api";

export function configured(value: string | undefined): value is string {
  return !!value && !/REPLACE|dummy|your[-_]project|YOUR_PROJECT_REF/i.test(value);
}

export function publicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!configured(url) || !configured(key)) {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "Supabase configuration is missing.");
  }
  return { url, key };
}

export function appOrigin(): string {
  const value = process.env.APP_ORIGIN;
  try {
    if (!value) throw new Error();
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) throw new Error();
    return url.origin;
  } catch {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "The application origin is not configured.");
  }
}
