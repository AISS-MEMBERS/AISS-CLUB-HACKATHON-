"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
    // Turkish month abbreviations
    OCA: 0,
    SUB: 1,
    ŞUB: 1,
    MAR_TR: 2,
    NIS: 3,
    NİS: 3,
    MAY_TR: 4,
    HAZ: 5,
    TEM: 6,
    AGU: 7,
    AĞU: 7,
    EYL: 8,
    EKI: 9,
    EKİ: 9,
    KAS: 10,
    ARA: 11,
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
    for (const part of parts) {
      const upper = part.toUpperCase().slice(0, 3);
      if (upper in months) {
        month = months[upper];
      } else {
        const parsedNum = parseInt(part, 10);
        if (!isNaN(parsedNum)) {
          if (parsedNum > 1000) {
            year = parsedNum;
          } else {
            day = parsedNum;
          }
        }
      }
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

interface CountdownDictionary {
  completed: string;
  inProgress: string;
  daysUnit: string;
  hoursUnit: string;
  minutesUnit: string;
  left: string;
}

function getCountdownText(
  start: Date,
  end: Date,
  dict: CountdownDictionary,
  now: Date = new Date()
): string {
  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();

  if (nowMs >= endMs) {
    return dict.completed;
  }

  if (nowMs >= startMs) {
    return dict.inProgress;
  }

  const diffMs = startMs - nowMs;
  if (diffMs <= 0) {
    return dict.inProgress;
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  // More than 24 hours remaining: display days, hours, and minutes
  if (days >= 1) {
    const paddedDays = String(days).padStart(2, "0");
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${paddedDays}${dict.daysUnit} ${paddedHours}${dict.hoursUnit} ${paddedMinutes}${dict.minutesUnit} ${dict.left}`;
  }

  // Less than 24 hours remaining: display hours and minutes
  if (totalHours >= 1) {
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${paddedHours}${dict.hoursUnit} ${paddedMinutes}${dict.minutesUnit} ${dict.left}`;
  }

  // Less than one hour remaining: display minutes only
  const displayMinutes = Math.max(1, minutes);
  const paddedMinutes = String(displayMinutes).padStart(2, "0");
  return `${paddedMinutes}${dict.minutesUnit} ${dict.left}`;
}

export default function EventCountdown({
  date,
  time,
  startDate,
  endDate,
  className = "",
}: EventCountdownProps) {
  const [countdown, setCountdown] = useState<string | null>(null);
  const { t } = useLanguage();
  const cdDict = t.events.countdown;

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
      setCountdown(getCountdownText(start, end, cdDict));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date, time, startDate, endDate, cdDict]);

  if (!countdown) {
    return null;
  }

  const isStatusText =
    countdown === cdDict.inProgress || countdown === cdDict.completed;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#1E2A5A] border border-white/25 px-2.5 py-0.5 text-[9.5px] min-[380px]:text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase text-center max-w-full leading-tight shrink-0 shadow-sm ${className}`.trim()}
      aria-label={
        isStatusText ? countdown : `${cdDict.ariaRemaining}: ${countdown}`
      }
    >
      {countdown}
    </span>
  );
}
