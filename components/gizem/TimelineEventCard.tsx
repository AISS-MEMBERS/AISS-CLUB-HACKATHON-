"use client";

import { useState } from "react";
import Image from "next/image";
import { ClubEvent } from "@/lib/backend/events/types";
import {
  computeEventStatus,
  formatDisplayDate,
  formatDisplayTime,
} from "@/lib/backend/events/mappers";

interface TimelineEventCardProps {
  event: ClubEvent;
  isFirst?: boolean;
}

function getTimelineImage(id: string): { src: string; alt: string } {
  switch (id) {
    case "featured-1":
      return {
        src: "/students/gizem/transformer-architecture.jpg",
        alt: "Transformer neural network architecture schematic diagram",
      };
    case "evt-1":
      return {
        src: "/students/gizem/llm-finetuning.jpg",
        alt: "Large language model fine-tuning data pipeline schematic diagram",
      };
    case "evt-2":
      return {
        src: "/students/gizem/computer-vision.jpg",
        alt: "Computer vision and OpenCV image processing pipeline schematic diagram",
      };
    case "evt-3":
      return {
        src: "/students/gizem/ai-ethics.jpg",
        alt: "AI ethics and data governance framework schematic diagram",
      };
    default:
      return {
        src: "/students/gizem/transformer-architecture.jpg",
        alt: "AI technical session schematic diagram",
      };
  }
}

export default function TimelineEventCard({
  event,
  isFirst = false,
}: TimelineEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUpcoming =
    computeEventStatus(event.startsAt, event.endsAt) === "upcoming";
  const displayDate = formatDisplayDate(event.startsAt);
  const displayTime = formatDisplayTime(event.startsAt, event.endsAt);
  const bgImageSrc = event.imagePath || getTimelineImage(event.id).src;
  const hasDetails = Boolean(event.location || event.lead);

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-[#DCDDD3]/30 bg-[#1E2A5A] p-5 sm:p-6 shadow-md transition-all duration-300 ease-out [@media(hover:hover)]:hover:scale-[1.04] [@media(hover:hover)]:hover:z-20 [@media(hover:hover)]:hover:shadow-[0_20px_40px_-8px_rgba(14,21,48,0.6)] flex flex-col justify-between flex-1 w-full min-h-[350px] sm:min-h-[380px] ${
        isFirst ? "origin-left" : "origin-center"
      }`}
    >
      {/* Scoped CSS for the subtle pulse animation matching FeaturedSessionCard */}
      <style>{`
        @keyframes subtleDotPulseTimeline {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-subtle-dot-timeline {
            animation: subtleDotPulseTimeline 2.5s ease-in-out infinite;
          }
        }
      `}</style>

      {/* Background Image: Specific to event topic */}
      <Image
        src={bgImageSrc}
        alt={`${event.title} session background`}
        fill
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 300px, 350px"
      />

      {/* Subtle Dark Navy Overlay for optimal text readability while maintaining image visibility */}
      <div
        className="absolute inset-0 bg-[#0E1530]/55 backdrop-blur-[0.5px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0E1530]/95 via-[#0E1530]/50 to-[#1E2A5A]/35"
        aria-hidden="true"
      />

      {/* CARD CONTENT */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* TOP AREA: Two-row layout (Row 1: Category & Status; Row 2: Date & Time) */}
        <div className="border-b border-white/20 pb-3 space-y-2.5">
          {/* First row: Category on the far left, Status badge immediately beside it */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-white/30 bg-[#1E2A5A]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm">
              {event.category}
            </span>

            {isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E2A5A] border border-white/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-subtle-dot-timeline"
                  aria-hidden="true"
                />
                UPCOMING
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#1E2A5A]/80 border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-200 shadow-sm backdrop-blur-sm">
                ARCHIVED
              </span>
            )}
          </div>

          {/* Second row: Event date and time directly below */}
          <div className="flex flex-wrap items-center">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-[#1E2A5A]/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-sm">
              <svg
                className="h-3.5 w-3.5 text-slate-300 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{displayDate}</span>
              {displayTime && (
                <>
                  <span className="text-white/40" aria-hidden="true">
                    •
                  </span>
                  <span className="font-normal text-slate-200">{displayTime}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* MIDDLE AREA: Title and Description (Always visible by default) */}
        <div className="my-4 flex-1 space-y-2.5">
          <h4 className="text-base font-bold text-white sm:text-lg leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            {event.title}
          </h4>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {event.description}
          </p>
        </div>

        {/* BOTTOM SECTION: Collapsible Lead & Location + Show more / Show less toggle */}
        <div className="mt-auto border-t border-white/15 pt-3 space-y-3">
          {/* Collapsible Area: Revealed on Show more */}
          {isExpanded && hasDetails && (
            <div
              id={`timeline-card-details-${event.id}`}
              className="space-y-1.5 text-[11px] sm:text-xs text-slate-200"
            >
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-slate-300 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
              )}
              {event.lead && (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-slate-300 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="truncate">{event.lead}</span>
                </div>
              )}
            </div>
          )}

          {/* Show more / Show less interactive control */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls={`timeline-card-details-${event.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E2A5A] border border-white/30 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#283875] hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2A5A] cursor-pointer"
            >
              <span>{isExpanded ? "Show less" : "Show more"}</span>
              <svg
                className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
