"use client";

import { useEffect, useState } from "react";

interface EventCountdownProps {
  date?: string;
  time?: string;
  startDate?: Date | string | number;
  endDate?: Date | string | number;
  className?: string;
}

function parseEventDates(dateStr: string = "", timeStr?: string): { start: Date; end: Date } {
  const months: Record<string, number> = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  const now = new Date();
  let year = now.getFullYear();
  let month = 9;
  let day = 28;

  const trimmedDate = (dateStr || "").trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmedDate)) {
    const parsed = new Date(trimmedDate);
    if (!isNaN(parsed.getTime())) {
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    }
  } else {
    const parts = trimmedDate.split(/[\s,]+/);
    const monthKey = parts[0]?.toUpperCase().slice(0, 3) || "OCT";
    if (monthKey in months) {
      month = months[monthKey];
    }
    if (parts[1]) {
      const parsedDay = parseInt(parts[1], 10);
      if (!isNaN(parsedDay)) {
        day = parsedDay;
      }
    }
    const yearPart = parts.find((p) => /^\d{4}$/.test(p));
    if (yearPart) {
      year = parseInt(yearPart, 10);
    }
  }

  let startHour = 18;
  let startMin = 0;
  let endHour = 20;
  let endMin = 0;

  if (timeStr) {
    const timeParts = timeStr.split(/[–—-]|(?:\s+to\s+)/i);
    if (timeParts[0]) {
      const [h, m] = timeParts[0].trim().split(":").map((v) => parseInt(v, 10));
      if (!isNaN(h)) startHour = h;
      if (!isNaN(m)) startMin = m;
    }
    if (timeParts[1]) {
      const [h, m] = timeParts[1].trim().split(":").map((v) => parseInt(v, 10));
      if (!isNaN(h)) endHour = h;
      if (!isNaN(m)) endMin = m;
    } else {
      endHour = startHour + 2;
      endMin = startMin;
    }
  }

  const start = new Date(year, month, day, startHour, startMin, 0, 0);
  const end = new Date(year, month, day, endHour, endMin, 0, 0);
  if (end.getTime() <= start.getTime()) {
    end.setDate(end.getDate() + 1);
  }

  return { start, end };
}

function getCountdownText(start: Date, end: Date, now: Date = new Date()): string {
  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();

  if (nowMs >= endMs) {
    return "COMPLETED";
  }

  if (nowMs >= startMs) {
    return "IN PROGRESS";
  }

  const diffMs = startMs - nowMs;
  if (diffMs <= 0) {
    return "IN PROGRESS";
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  // More than 24 hours remaining: display days, hours, and minutes, e.g. 13D 01H 47M LEFT
  if (days >= 1) {
    const paddedDays = String(days).padStart(2, "0");
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${paddedDays}D ${paddedHours}H ${paddedMinutes}M LEFT`;
  }

  // Less than 24 hours remaining: display hours and minutes, e.g. 23H 47M LEFT
  if (totalHours >= 1) {
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${paddedHours}H ${paddedMinutes}M LEFT`;
  }

  // Less than one hour remaining: display minutes only, e.g. 47M LEFT
  // Never show zero-valued units: if diffMs > 0 but totalMinutes == 0 (e.g. 30s left), display at least 01M
  const displayMinutes = Math.max(1, minutes);
  const paddedMinutes = String(displayMinutes).padStart(2, "0");
  return `${paddedMinutes}M LEFT`;
}

export default function EventCountdown({
  date,
  time,
  startDate,
  endDate,
  className = "",
}: EventCountdownProps) {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    const { start, end } = startDate
      ? {
          start: new Date(startDate),
          end: endDate
            ? new Date(endDate)
            : new Date(new Date(startDate).getTime() + 2 * 60 * 60 * 1000),
        }
      : parseEventDates(date, time);

    const update = () => {
      setCountdown(getCountdownText(start, end));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date, time, startDate, endDate]);

  if (!countdown) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#1E2A5A] border border-white/25 px-2.5 py-0.5 text-[9.5px] min-[380px]:text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase text-center max-w-full leading-tight shrink-0 shadow-sm ${className}`.trim()}
      aria-label={
        countdown === "IN PROGRESS" || countdown === "COMPLETED"
          ? countdown
          : `Time remaining: ${countdown}`
      }
    >
      {countdown}
    </span>
  );
}
