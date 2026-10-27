import { coverObjectName, COVER_BUCKET, MAX_COVER_BYTES } from "@/lib/event-covers";
import { publicSupabaseConfig } from "@/lib/backend/shared/config";

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const name = coverObjectName(`/api/event-covers/${path.join("/")}`);
  if (!name) return new Response(null, { status: 404 });
  try {
    const { url } = publicSupabaseConfig();
    const source = new URL(`/storage/v1/object/public/${COVER_BUCKET}/${name}`, url);
    const upstream = await fetch(source, { redirect: "error", signal: AbortSignal.timeout(10000) });
    if (upstream.status === 404 || upstream.status === 400) return new Response(null, { status: 404 });
    if (!upstream.ok || !upstream.headers.get("content-type")?.startsWith("image/jpeg") ||
      Number(upstream.headers.get("content-length")) > MAX_COVER_BYTES) {
      return new Response(null, { status: 502 });
    }
    const image = await upstream.arrayBuffer();
    if (image.byteLength > MAX_COVER_BYTES) return new Response(null, { status: 502 });
    return new Response(image, { headers: {
      "Content-Type": "image/jpeg", "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    } });
  } catch { return new Response(null, { status: 503 }); }
}
