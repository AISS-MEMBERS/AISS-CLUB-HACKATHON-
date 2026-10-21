"use client";

import { useState } from "react";
import Image from "next/image";
import EventCountdown from "./EventCountdown";

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  lead?: string;
  category: "WORKSHOP" | "TALK" | "BUILD SESSION";
  description: string;
  status: "upcoming" | "past";
}

interface FeaturedSessionCardProps {
  event: ClubEvent;
}

export default function FeaturedSessionCard({ event }: FeaturedSessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#DCDDD3] bg-[#1E2A5A] p-6 shadow-md transition-transform duration-300 ease-out origin-center [@media(hover:hover)]:hover:scale-[1.04] [@media(hover:hover)]:hover:z-10 md:p-8">
      {/* Scoped CSS for the slow, subtle blinking animation on the white dot */}
      <style>{`
        @keyframes subtleDotPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-subtle-dot {
            animation: subtleDotPulse 2.5s ease-in-out infinite;
          }
        }
      `}</style>

      {/* Background Image: Transformer Neural Network Architecture Schematic */}
      <Image
        src="/students/gizem/transformer-architecture.jpg"
        alt="Transformer neural network architecture schematic diagram"
        fill
        priority
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
      />

      {/* Subtle Navy / Dark Overlay — Kept subtle so the Transformer architecture schematic is clearly visible */}
      <div
        className="absolute inset-0 bg-[#0E1530]/50 backdrop-blur-[0.5px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0E1530]/90 via-[#0E1530]/40 to-[#1E2A5A]/30"
        aria-hidden="true"
      />

      {/* TOP AREA: Category and Navy UPCOMING status (Date, Time, Countdown moved into expanded section) */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 border-b border-white/20 pb-4">
        <span className="inline-flex items-center rounded-md border border-white/30 bg-[#1E2A5A]/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm">
          {event.category}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E2A5A] border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          <span
            className="inline-block h-2 w-2 rounded-full bg-white animate-subtle-dot"
            aria-hidden="true"
          />
          UPCOMING
        </span>
      </div>

      {/* MIDDLE AREA: Prominent Event Title (Always visible) */}
      <div className="relative z-10 my-5 sm:my-6">
        <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
          {event.title}
        </h3>
      </div>

      {/* EXPANDED CONTENT: Date, Time, Countdown, Description, Location, Lead & Free Entry CTA */}
      {isExpanded && (
        <div
          id="featured-event-expanded-content"
          className="relative z-10 space-y-5 border-t border-white/15 pt-5 pb-2"
        >
          {/* 1. Date, Time & Live Countdown Schedule Block */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#1E2A5A]/90 px-3 py-1.5 text-slate-100 backdrop-blur-sm border border-white/25 shadow-sm">
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
              <span className="font-semibold text-white tracking-wide">{event.date}</span>
              {event.time && (
                <>
                  <span className="text-white/40" aria-hidden="true">•</span>
                  <span className="text-slate-200">{event.time}</span>
                </>
              )}
            </div>
            <EventCountdown date={event.date} time={event.time} />
          </div>

          {/* 2. Complete Event Description */}
          <p
            id="featured-event-description"
            className="max-w-3xl text-sm leading-relaxed text-slate-100 sm:text-base sm:leading-relaxed font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            {event.description}
          </p>

          {/* 3. Location, Lead, and Free Entry CTA */}
          <div
            id="featured-event-metadata"
            className="flex flex-col gap-4 border-t border-white/15 pt-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-slate-200"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {event.location && (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-300"
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
                  <span>
                    <strong className="font-semibold text-white">Location:</strong>{" "}
                    <span className="text-slate-100">{event.location}</span>
                  </span>
                </div>
              )}
              {event.lead && (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-300"
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
                  <span>
                    <strong className="font-semibold text-white">Lead:</strong>{" "}
                    <span className="text-slate-100">{event.lead}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-white">
                Free entry for students &rarr;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM AREA: Clearly visible Show more / Show less interactive control */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-3">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls="featured-event-expanded-content"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E2A5A] border border-white/30 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#283875] hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2A5A] cursor-pointer"
        >
          <span>{isExpanded ? "Show less" : "Show more"}</span>
          <svg
            className={`h-4 w-4 text-white transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
