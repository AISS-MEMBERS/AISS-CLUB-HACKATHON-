"use client";

import { useEffect, useState } from "react";
import FeaturedSessionCard from "./FeaturedSessionCard";
import TimelineEventCard from "./TimelineEventCard";
import MobileCardCarousel from "@/components/shared/MobileCardCarousel";
import type { ApiResult, ClubEvent } from "@/types/backend";
import { computeEventStatus } from "@/lib/backend/events/mappers";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; events: ClubEvent[] };

export default function EventsData() {
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchEvents() {
      try {
        const response = await fetch("/api/events", {
          headers: { Accept: "application/json" },
        });

        const json = (await response.json()) as ApiResult<{
          items: ClubEvent[];
          page: number;
        }>;

        if (!isMounted) return;

        if (!response.ok || !json.success) {
          const errorMsg =
            !json.success && json.error?.message
              ? json.error.message
              : `Failed to load events (HTTP ${response.status}).`;
          setState({ status: "error", message: errorMsg });
          return;
        }

        const publishedItems = json.data.items || [];
        if (publishedItems.length === 0) {
          setState({ status: "empty" });
        } else {
          setState({ status: "success", events: publishedItems });
        }
      } catch {
        if (isMounted) {
          setState({
            status: "error",
            message: "Network error occurred while fetching club events.",
          });
        }
      }
    }

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  const handleRetry = () => {
    setState({ status: "loading" });
    setRetryKey((prev) => prev + 1);
  };

  // 1. LOADING STATE
  if (state.status === "loading") {
    return (
      <div
        aria-live="polite"
        aria-busy="true"
        className="space-y-10 py-6"
      >
        {/* Featured card skeleton */}
        <div className="w-full px-4 sm:px-6">
          <div className="h-[280px] w-full animate-pulse rounded-xl bg-[#1E2A5A]/15 border border-[#DCDDD3]" />
        </div>

        {/* Timeline skeleton */}
        <div className="space-y-4 px-4 sm:px-6">
          <div className="h-4 w-48 animate-pulse rounded bg-[#1E2A5A]/15" />
          <div className="flex gap-6 overflow-hidden pt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[350px] w-[300px] shrink-0 animate-pulse rounded-xl bg-[#1E2A5A]/15 border border-[#DCDDD3]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE (distinguishes real failure, no hidden fake fallback)
  if (state.status === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="my-8 rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center text-[#1E2A5A]"
      >
        <p className="font-semibold text-rose-800">
          Academic sessions currently unavailable
        </p>
        <p className="mt-1 text-xs text-[#1E2A5A]/70">{state.message}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 inline-flex items-center rounded-lg border border-[#1E2A5A]/30 bg-[#1E2A5A] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#283875] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // 3. EMPTY STATE (clean notice when no events are published)
  if (state.status === "empty") {
    return (
      <div className="my-10 rounded-xl border border-[#DCDDD3] bg-white/40 p-8 text-center text-sm text-[#1E2A5A]/80">
        <p className="font-semibold text-[#1E2A5A]">
          No published sessions at this time
        </p>
        <p className="mt-1 text-xs text-[#1E2A5A]/70">
          Check back soon for upcoming workshops, talks, and build sessions.
        </p>
      </div>
    );
  }

  // 4. SUCCESS STATE: Connect to real published events
  const { events } = state;
  const featuredEvent = events.find((e) => e.isFeatured);

  return (
    <>
      {/* FEATURED UPCOMING EVENT CARD (omitted if no published featured event exists) */}
      {featuredEvent && (
        <div className="mb-10">
          <div className="-mt-4 mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E2A5A]">
              Featured Session // Next Up
            </span>
          </div>

          <div className="w-full px-4 sm:px-6">
            <FeaturedSessionCard event={featuredEvent} />
          </div>
        </div>
      )}

      {/* CHRONOLOGICAL TIMELINE */}
      <div>
        <div className="mb-0 mt-10 flex items-center justify-between pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E2A5A]">
            Semester Timeline // All Sessions
          </h3>
          <span className="text-xs text-[#1E2A5A]">
            {events.length} {events.length === 1 ? "SESSION" : "SESSIONS"} LISTED
          </span>
        </div>

        <MobileCardCarousel
          count={events.length}
          label="Semester timeline events"
          className="relative flex items-stretch gap-6 overflow-x-auto pb-6 pt-4 px-4 sm:px-6 scroll-smooth snap-x snap-mandatory focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
        >
          {events.map((event, index) => {
            const isUpcoming =
              computeEventStatus(event.startsAt, event.endsAt) === "upcoming";

            return (
              <li
                key={event.id}
                className="relative flex flex-col flex-shrink-0 snap-start w-[min(300px,calc(100vw-4rem))] sm:w-[340px] lg:w-[350px] [@media(hover:hover)]:hover:z-20"
              >
                {/* Timeline horizontal connector track & indicator dot */}
                <div className="relative mb-3 flex items-center">
                  <div
                    className={`absolute top-1/2 h-0.5 -translate-y-1/2 bg-[#DCDDD3] ${
                      index === 0
                        ? "left-0 -right-6"
                        : index === events.length - 1
                        ? "-left-6 right-0"
                        : "-left-6 -right-6"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`relative z-10 ml-6 h-3.5 w-3.5 rounded-full border-2 border-[#F5F3EC] ${
                      isUpcoming
                        ? "bg-[#1E2A5A] ring-2 ring-[#1E2A5A] shadow-[0_0_8px_rgba(30,42,90,0.5)]"
                        : "bg-[#1E2A5A]"
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <TimelineEventCard event={event} isFirst={index === 0} />
              </li>
            );
          })}
        </MobileCardCarousel>
      </div>
    </>
  );
}
