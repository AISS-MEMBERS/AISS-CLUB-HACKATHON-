"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";
import { useMobileCardCarousel } from "@/components/shared/MobileCardCarousel";

/**
 * Type contract for community statistics
 * Allows straightforward replacement when verified metrics are published
 */
export interface ClubStat {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly detail: string;
  readonly isPlaceholder: boolean;
}

/**
 * Type contract for core research and engineering focus areas
 */
export interface FocusArea {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly topics: readonly string[];
}

/**
 * Static club statistics data array
 */
export const CLUB_STATS: readonly ClubStat[] = [
  {
    id: "workshops",
    value: "[Verified workshop count]",
    label: "Hands-on Workshops",
    detail: "PyTorch labs, model architecture deep-dives, and systems code sprints.",
    isPlaceholder: true,
  },
  {
    id: "members",
    value: "[Verified member count]",
    label: "Active Contributors",
    detail: "Undergraduate and graduate students across CS, data, and engineering.",
    isPlaceholder: true,
  },
  {
    id: "working-groups",
    value: "[Verified working group count]",
    label: "Specialized Working Groups",
    detail: "Autonomous tracks in ML foundations, vision systems, and AI policy.",
    isPlaceholder: true,
  },
  {
    id: "events",
    value: "[Verified annual event count]",
    label: "Annual Hackathons",
    detail: "Open university-wide build competitions and research symposiums.",
    isPlaceholder: true,
  },
] as const;

/**
 * Three core community focus areas with large typography titles
 */
export const FOCUS_AREAS: readonly FocusArea[] = [
  {
    id: "ml-fundamentals",
    index: "01",
    title: "Machine Learning",
    description:
      "Investigating core learning algorithms, gradient optimization, loss landscape geometry, and model evaluation metrics through clean PyTorch implementations.",
    topics: ["Statistical Learning", "Gradient Methods", "PyTorch"],
  },
  {
    id: "vision-robotics",
    index: "02",
    title: "Computer Vision",
    description:
      "Connecting perceptual representations with real-time physical systems, covering spatial intelligence, visual SLAM, and embedded neural inference.",
    topics: ["Spatial Intelligence", "Edge Inference", "ROS 2"],
  },
  {
    id: "responsible-ai",
    index: "03",
    title: "Responsible AI",
    description:
      "Approaching algorithmic fairness, safety auditing, and dataset provenance as foundational engineering specifications for autonomous systems.",
    topics: ["Algorithmic Fairness", "Safety Auditing", "Governance"],
  },
] as const;

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeMobile(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getMobileSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export default function About() {
  const [activeCard, setActiveCard] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [tilt, setTilt] = useState<{ index: number; x: number; y: number } | null>(null);
  const [showStats, setShowStats] = useState(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    () => false
  );

  const { trackRef: carouselRef, activeIndex: mobileIndex, goTo } =
    useMobileCardCarousel<HTMLDivElement>(FOCUS_AREAS.length);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const effectiveCard = isMobile ? mobileIndex : hoveredCard !== null ? hoveredCard : activeCard;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (prefersReducedMotion || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ index, x, y });
  };

  const handleMouseLeave = () => {
    setTilt(null);
    setHoveredCard(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToCard(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % FOCUS_AREAS.length;
      scrollToCard(next);
      cardRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + FOCUS_AREAS.length) % FOCUS_AREAS.length;
      scrollToCard(prev);
      cardRefs.current[prev]?.focus();
    }
  };

  const scrollToCard = (index: number) => {
    setActiveCard(index);
    if (isMobile) goTo(index);
  };

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="site-section text-[#181A18] font-sans antialiased"
    >
      <div className="site-container">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Centered Intro: Strong Navy Heading & Balanced Typography        */}
      {/* ------------------------------------------------------------------ */}
      <header className="w-full text-center">
        {/* Horizontally scrolling news-ticker-style text band */}
        <div
          className="relative mt-3 w-full overflow-hidden border-y border-[#E2E1DA] py-2.5 sm:py-3.5"
          role="region"
          aria-label="About AISS Headlines Ticker"
        >
          {/* Subtle edge gradient dissolves for broadcast ticker look */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-[#F5F3EC] to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-[#F5F3EC] to-transparent"
            aria-hidden="true"
          />

          <h2
            id="about-heading"
            aria-label="Intelligence Built Through Curiosity and Collaboration"
            className="flex w-max select-none text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1E2A5A] leading-tight"
          >
            {/* Primary Track */}
            <span className="flex shrink-0 items-center aiss-ticker-track">
              {[0, 1, 2, 3].map((i) => (
                <span key={`ticker-a-${i}`} className="inline-flex items-center">
                  <span>Intelligence Built Through Curiosity and Collaboration</span>
                  <span
                    className="mx-6 sm:mx-8 select-none text-[#1E2A5A]"
                    aria-hidden="true"
                  >
                    •
                  </span>
                </span>
              ))}
            </span>

            {/* Seamless Duplicate Track for Infinite Loop */}
            <span
              className="flex shrink-0 items-center aiss-ticker-track"
              aria-hidden="true"
            >
              {[0, 1, 2, 3].map((i) => (
                <span key={`ticker-b-${i}`} className="inline-flex items-center">
                  <span>Intelligence Built Through Curiosity and Collaboration</span>
                  <span
                    className="mx-6 sm:mx-8 select-none text-[#1E2A5A]"
                    aria-hidden="true"
                  >
                    •
                  </span>
                </span>
              ))}
            </span>
          </h2>
        </div>

        <p className="mt-2 text-sm sm:text-base text-[#5F6368] font-normal">
        </p>
      </header>

      <style>{`
        @keyframes aiss-ticker {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .aiss-ticker-track {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          white-space: nowrap;
          animation: aiss-ticker 35s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .aiss-ticker-track {
            animation-play-state: paused;
          }
        }
      `}</style>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Overlapping 3D Fan Carousel Cards                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative mt-6 sm:mt-8">

        {/* 3D Carousel Container */}
        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Core Focus Areas"
          className="flex md:flex-row md:justify-center md:items-stretch overflow-x-auto md:overflow-visible pb-4 md:pb-8 pt-4 snap-x snap-mandatory [perspective:1200px] gap-4 md:gap-0 md:-space-x-8 lg:-space-x-10"
          style={{ scrollbarWidth: "none" }}
        >
          {FOCUS_AREAS.map((area, index) => {
            const isFeatured = effectiveCard === index;

            // Subtle fan angles on resting load and active states
            let baseRotateY = 0;
            let baseRotateZ = 0;

            if (!isMobile && !prefersReducedMotion) {
              if (isFeatured) {
                baseRotateY = 0;
                baseRotateZ = 0;
              } else if (index < effectiveCard) {
                baseRotateY = 6;
                baseRotateZ = -1.2;
              } else {
                baseRotateY = -6;
                baseRotateZ = 1.2;
              }
            }

            const tiltRotateX =
              tilt && tilt.index === index && !prefersReducedMotion && !isMobile
                ? -tilt.y * 4
                : 0;

            const tiltRotateY =
              tilt && tilt.index === index && !prefersReducedMotion && !isMobile
                ? baseRotateY + tilt.x * 5
                : baseRotateY;

            const scale = prefersReducedMotion
              ? 1
              : isMobile
                ? isFeatured
                  ? 1.02
                  : 0.98
                : isFeatured
                  ? 1.04
                  : 0.96;

            const translateZ =
              !isMobile && !prefersReducedMotion && isFeatured ? 28 : 0;
            const translateY =
              !isMobile && !prefersReducedMotion && isFeatured ? -6 : 0;

            const transformStyle = prefersReducedMotion
              ? undefined
              : isMobile
                ? `scale(${scale})`
                : `perspective(1200px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg) rotateZ(${baseRotateZ}deg) scale(${scale})`;

            // Center card starts in front on initial load; hovered card always moves to topmost z-index
            const zIndexClass = isFeatured
              ? "z-30"
              : index === 1
                ? "z-20"
                : "z-10";

            return (
              <div
                key={area.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={area.title}
                tabIndex={0}
                onClick={() => scrollToCard(index)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => scrollToCard(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  transform: transformStyle,
                  transformStyle: isMobile ? "flat" : "preserve-3d",
                  boxShadow: isFeatured
                    ? "0 24px 48px -12px rgba(30, 42, 90, 0.22), 0 12px 24px -8px rgba(30, 42, 90, 0.14)"
                    : "0 4px 12px -2px rgba(30, 42, 90, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), background-color 600ms ease, color 600ms ease, border-color 600ms ease, box-shadow 600ms ease",
                }}
                className={`relative flex flex-col justify-between rounded-xl p-6 sm:p-7 cursor-pointer border select-none outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] snap-center min-w-[85vw] sm:min-w-[65vw] md:min-w-0 md:w-80 lg:w-[350px] md:max-w-sm md:flex-1 ${zIndexClass} ${isFeatured
                  ? "bg-[#1E2A5A] text-white border-[#1E2A5A]"
                  : "bg-white text-[#181A18] border-[#E2E1DA] hover:border-[#1E2A5A]/40"
                  }`}
              >
                <div>
                  <h4
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug transition-colors duration-600 ${isFeatured ? "text-white" : "text-[#1E2A5A]"
                      }`}
                  >
                    {area.title}
                  </h4>

                  <p
                    className={`mt-3 text-xs sm:text-sm leading-relaxed transition-colors duration-600 ${isFeatured ? "text-white/85" : "text-[#5F6368]"
                      }`}
                  >
                    {area.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-current/15">
                  <div className="flex flex-wrap gap-1.5">
                    {area.topics.map((topic) => (
                      <span
                        key={topic}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors duration-600 ${isFeatured
                          ? "bg-white/15 text-white border border-white/20"
                          : "bg-[#F7F6F2] text-[#1E2A5A] border border-[#E2E1DA]"
                          }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Clean, Unobtrusive Text Link for Verified Statistics            */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-8 pt-4 border-t border-[#E2E1DA]/80">
        <button
          type="button"
          onClick={() => setShowStats(!showStats)}
          aria-expanded={showStats}
          aria-controls="about-stats-panel"
          className="text-xs font-semibold text-[#1E2A5A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] rounded px-1.5 py-0.5 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>{showStats ? "Show less metrics ↑" : "Show more club metrics ↓"}</span>
        </button>

        <div
          id="about-stats-panel"
          aria-hidden={!showStats}
          className={`grid transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${showStats
            ? "opacity-100 mt-5 pt-5 border-t border-[#E2E1DA]"
            : "opacity-0 mt-0 pt-0 border-t-0 pointer-events-none"
            }`}
          style={{
            gridTemplateRows: showStats ? "1fr" : "0fr",
            transitionDuration: prefersReducedMotion ? "0ms" : "450ms",
          }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="rounded-xl bg-[#1E2A5A] text-white overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y divide-white/15 md:divide-y-0 md:divide-x md:divide-white/15">
                {CLUB_STATS.map((stat) => (
                  <article
                    key={stat.id}
                    className="group flex flex-col justify-between p-5 md:p-4 lg:p-6 transition-colors duration-250 ease-in-out hover:bg-white/[0.04] cursor-default"
                  >
                    <div>
                      <h4 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white leading-snug">
                        {stat.label}
                      </h4>

                      <div className="mt-2.5">
                        {stat.isPlaceholder ? (
                          <span className="inline-block rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-[#F7F6F2] font-medium transition-colors duration-250 group-hover:bg-white/15 group-hover:border-white/30">
                            {stat.value}
                          </span>
                        ) : (
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            {stat.value}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3.5 text-xs sm:text-sm text-[#F7F6F2]/80 leading-relaxed transition-colors duration-250 group-hover:text-[#F7F6F2]">
                      {stat.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
