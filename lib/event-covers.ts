/** Shared format, never an arbitrary remote URL or filesystem path. */
export const COVER_BUCKET = "event-covers";
export const MAX_COVER_BYTES = 2 * 1024 * 1024;
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const COVER_PATH = new RegExp(`^/api/event-covers/(${UUID})/(${UUID}\\.jpg)$`);
export function coverObjectName(path: string): string | null {
  const match = COVER_PATH.exec(path);
  return match ? `${match[1]}/${match[2]}` : null;
}
