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
  // APP_ORIGIN is explicit locally. Vercel's trusted system variable provides
  // the stable production origin on the first deployment when no override exists.
  const value = process.env.APP_ORIGIN || (process.env.VERCEL === "1" &&
    process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
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
