/**
 * Europe/Istanbul Timezone Utilities
 * Contract requirement: All club event times are strictly in Europe/Istanbul (TRT, UTC+3).
 * Verification example: "2026-10-26 18:00 Europe/Istanbul" -> "2026-10-26T15:00:00.000Z"
 */

export const TIMEZONE_LABEL = "Europe/Istanbul (TRT, UTC+3)";

/**
 * Converts a <input type="datetime-local"> value (YYYY-MM-DDTHH:mm) into a full ISO 8601 UTC string.
 * Uses Europe/Istanbul (+03:00) fixed offset regardless of the visitor's local browser timezone.
 */
export function istanbulDatetimeLocalToIso(datetimeLocal: string): string | null {
  const trimmed = datetimeLocal?.trim();
  if (!trimmed) return null;

  // Match YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss
  const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
  const match = trimmed.match(regex);
  if (!match) return null;

  const [, year, month, day, hour, minute, second = "00"] = match;
  // Turkey is UTC+3 permanently since October 2016
  const isoWithOffset = `${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`;
  const dateObj = new Date(isoWithOffset);

  if (isNaN(dateObj.getTime())) {
    return null;
  }

  return dateObj.toISOString();
}

/**
 * Converts a stored ISO 8601 UTC string into a HTML <input type="datetime-local"> value
 * represented in Europe/Istanbul time (YYYY-MM-DDTHH:mm).
 */
export function isoToIstanbulDatetimeLocal(isoString: string | null | undefined): string {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(dateObj);

  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";
  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");

  if (!year || !month || !day || !hour || !minute) return "";
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Formats an ISO string for human display in Europe/Istanbul time.
 */
export function formatIstanbulDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "Belirtilmedi";
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) return "Geçersiz Tarih";

  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}
