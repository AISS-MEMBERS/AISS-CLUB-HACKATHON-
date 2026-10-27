import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { ApiError } from "./api";
import { appOrigin, configured } from "./config";
import { createPrivilegedSupabaseClient } from "@/lib/supabase/privileged";

export function requireSameOrigin(request: Request): void {
  const expected = appOrigin();
  if (request.headers.get("origin") !== expected) {
    throw new ApiError(403, "FORBIDDEN_ORIGIN", "Cross-origin requests are not allowed.");
  }
}

export async function readJsonBody(request: Request, maxBytes = 16384): Promise<unknown> {
  const media = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (media !== "application/json") throw new ApiError(400, "INVALID_CONTENT_TYPE", "Expected application/json.");
  if (Number(request.headers.get("content-length")) > maxBytes) {
    throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body is too large.");
  }
  if (!request.body) throw new ApiError(400, "EMPTY_BODY", "A JSON body is required.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body is too large.");
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "BODY_READ_ERROR", "Unable to read the request.");
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(merged)) as unknown;
  } catch {
    throw new ApiError(400, "INVALID_JSON", "A valid JSON body is required.");
  }
}

async function enforceRateLimit(request: Request, scope: "contact" | "login"): Promise<void> {
  const secret = process.env.RATE_LIMIT_HMAC_SECRET;
  if (!configured(secret) || secret.length < 32) {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "Request protection is not configured.");
  }
  let identity: string;
  if (process.env.VERCEL === "1") {
    const address = request.headers.get("x-vercel-forwarded-for")?.trim();
    if (!address || !isIP(address)) {
      throw new ApiError(503, "SERVICE_UNAVAILABLE", "Trusted request identity is unavailable.");
    }
    identity = address;
  } else if (["localhost", "127.0.0.1", "[::1]"].includes(new URL(appOrigin()).hostname)) {
    // One shared bucket for loopback-only development; ignore spoofable client headers.
    identity = "local-development";
  } else {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "A trusted deployment proxy must be configured.");
  }
  const bucket = createHmac("sha256", secret).update(identity).digest("hex");
  const client = createPrivilegedSupabaseClient();
  const { data, error } = await client.rpc("aiss_consume_rate_limit", {
    p_scope: scope, p_bucket: bucket,
  });
  if (error || !data?.length) {
    throw new ApiError(503, "SERVICE_UNAVAILABLE", "Request protection is unavailable.");
  }
  if (!data[0].allowed) {
    throw new ApiError(429, "RATE_LIMITED", "Too many requests. Please try again later.",
      undefined, data[0].retry_after);
  }
}
export const enforceContactRateLimit = (request: Request) => enforceRateLimit(request, "contact");
export const enforceLoginRateLimit = (request: Request) => enforceRateLimit(request, "login");
