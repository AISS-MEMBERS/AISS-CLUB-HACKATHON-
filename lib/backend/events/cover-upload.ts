import "server-only";
import sharp from "sharp";
import { ApiError } from "@/lib/backend/shared/api";
import { MAX_COVER_BYTES } from "@/lib/event-covers";

export async function normalizedCover(request: Request): Promise<Buffer> {
  const type = request.headers.get("content-type")?.split(";")[0].trim();
  if (!type || !["image/jpeg", "image/png", "image/webp"].includes(type)) {
    throw new ApiError(415, "INVALID_IMAGE", "JPEG, PNG veya WebP bir fotoğraf seçin.");
  }
  if (Number(request.headers.get("content-length")) > MAX_COVER_BYTES) {
    throw new ApiError(413, "IMAGE_TOO_LARGE", "Hazırlanan görsel en fazla 2 MB olabilir.");
  }
  if (!request.body) throw new ApiError(400, "EMPTY_IMAGE", "Bir fotoğraf seçin.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_COVER_BYTES) {
        await reader.cancel();
        throw new ApiError(413, "IMAGE_TOO_LARGE", "Hazırlanan görsel en fazla 2 MB olabilir.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try {
    const input = Buffer.concat(chunks);
    const magicMatches = (type === "image/jpeg" && input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff) ||
      (type === "image/png" && input.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ||
      (type === "image/webp" && input.toString("ascii", 0, 4) === "RIFF" && input.toString("ascii", 8, 12) === "WEBP");
    if (!magicMatches) throw new Error();
    const source = sharp(input, { limitInputPixels: 16_000_000, animated: false });
    const metadata = await source.metadata();
    const expected = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp" }[type];
    if (metadata.format !== expected || (metadata.pages ?? 1) > 1) throw new Error();
    // Re-encode real raster pixels; remove EXIF/GPS and never store SVG/HTML or the original filename.
    const output = await source.rotate().resize({ width: 1920, height: 1920,
      fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
    if (output.byteLength > MAX_COVER_BYTES) throw new Error();
    return output;
  } catch {
    throw new ApiError(400, "INVALID_IMAGE", "Fotoğraf okunamadı. Daha küçük bir JPEG, PNG veya WebP seçin.");
  }
}
