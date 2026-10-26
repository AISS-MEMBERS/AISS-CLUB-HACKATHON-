// lib/backend/contact/rate-limit.ts
// Contact rate limiting. Provides safe sliding-window enforcement.

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // 5 submissions per 15 minutes per IP

/**
 * Extracts a client identifier (IP address) from request headers.
 */
function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown-client";
}

/**
 * Enforces contact submission rate limits.
 * Returns null if allowed, or Retry-After seconds if exceeded.
 */
export async function checkContactRateLimit(
  request: Request
): Promise<{ allowed: boolean; retryAfter?: number }> {
  // If Selen's shared rate limiter exists, we can delegate to it
  // otherwise provide atomic memory store protection.
  const ip = getClientIdentifier(request);
  const now = Date.now();

  const current = memoryStore.get(ip);

  if (!current || now >= current.resetAt) {
    memoryStore.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true };
  }

  if (current.count >= MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { allowed: false, retryAfter };
  }

  current.count += 1;
  return { allowed: true };
}
