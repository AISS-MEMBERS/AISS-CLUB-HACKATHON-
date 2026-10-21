'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { TeamMember } from './types';
import { MemberCard } from './MemberCard';

interface TeamShowcaseProps {
  members: TeamMember[];
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

function subscribeViewport(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getViewportSnapshot(): ViewportSize {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getViewportServerSnapshot(): ViewportSize {
  return 'desktop';
}

export function TeamShowcase({ members }: TeamShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const total = members.length;

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const viewport = useSyncExternalStore(
    subscribeViewport,
    getViewportSnapshot,
    getViewportServerSnapshot
  );
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Automatic rotation: comfortable 5s interval, paused on hover/focus/manual pause or reduced motion
  useEffect(() => {
    if (isHovered || isFocused || isManualPaused || prefersReducedMotion || total <= 1) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, isFocused, isManualPaused, prefersReducedMotion, total, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentIndex(total - 1);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Calculate circular offset: returns value in [-floor(total/2), floor((total-1)/2)]
  const getOffset = (index: number) => {
    let offset = (index - currentIndex) % total;
    if (offset > Math.floor(total / 2)) {
      offset -= total;
    } else if (offset < -Math.floor((total - 1) / 2)) {
      offset += total;
    }
    return offset;
  };

  // Calculate coordinates and styling based on circular offset
  const getCardStyle = (offset: number) => {
    const transition = prefersReducedMotion
      ? 'none'
      : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 600ms cubic-bezier(0.25, 1, 0.5, 1)';

    // Active Featured Card (Center)
    if (offset === 0) {
      return {
        transform: 'translate3d(0, 0, 0) scale(1)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto' as const,
        transition,
      };
    }

    // Immediate Neighbor (Right)
    if (offset === 1) {
      const x = isMobile ? 150 : isTablet ? 225 : 265;
      const y = isMobile ? 10 : isTablet ? 12 : 14;
      const scale = isMobile ? 0.76 : isTablet ? 0.8 : 0.82;
      return {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: isMobile ? 0.75 : 0.82,
        zIndex: 20,
        pointerEvents: 'auto' as const,
        transition,
      };
    }

    // Immediate Neighbor (Left)
    if (offset === -1) {
      const x = isMobile ? -150 : isTablet ? -225 : -265;
      const y = isMobile ? 10 : isTablet ? 12 : 14;
      const scale = isMobile ? 0.76 : isTablet ? 0.8 : 0.82;
      return {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: isMobile ? 0.75 : 0.82,
        zIndex: 20,
        pointerEvents: 'auto' as const,
        transition,
      };
    }

    // Distant Orbiting Cards (offset >= 2 or <= -2):
    // Smoothly orbit in background with opacity 0 to eliminate ghost duplicates and clipped text
    const direction = offset > 0 ? 1 : -1;
    const x = direction * (isMobile ? 220 : isTablet ? 330 : 380);
    return {
      transform: `translate3d(${x}px, 32px, 0) scale(0.6)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none' as const,
      transition,
    };
  };

  const currentMember = members[currentIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="AISS Club team members showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-4xl mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] rounded-2xl"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing team member {currentIndex + 1} of {total}: {currentMember.name}
        {currentMember.role ? `, ${currentMember.role}` : ''}
      </div>

      {/* Circular Orbit Graphic Track */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[280px] w-[520px] sm:h-[320px] sm:w-[700px] md:h-[360px] md:w-[840px] rounded-[50%] border border-dashed border-[#DCDDD3]" />
      </div>

      {/* Stage: Height reserved for featured card and circular orbiting cards */}
      <div className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center overflow-hidden py-4">
        {members.map((member, index) => {
          const offset = getOffset(index);
          const isFeatured = offset === 0;
          const isDistant = Math.abs(offset) >= 2;
          const style = getCardStyle(offset);

          return (
            <div
              key={member.id}
              style={style}
              className="absolute w-[280px] sm:w-[320px] will-change-transform"
              aria-hidden={!isFeatured}
            >
              <MemberCard
                member={member}
                isFeatured={isFeatured}
                isDistant={isDistant}
                onClick={!isFeatured ? () => setCurrentIndex(index) : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Controls & Pagination Area */}
      <div className="mt-6 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous team member"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1E2A5A] bg-[#1E2A5A] text-white transition-all duration-150 hover:bg-[#151D3F] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2 shadow-xs cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Member Dot Indicators */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 px-2"
            role="tablist"
            aria-label="Team member slides"
          >
            {members.map((member, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={member.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}: ${member.name}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-1 ${isActive
                    ? 'h-2.5 w-7 bg-[#1E2A5A]'
                    : 'h-2.5 w-2.5 bg-[#A6B39A] hover:bg-[#77796F]'
                    }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next team member"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1E2A5A] bg-[#1E2A5A] text-white transition-all duration-150 hover:bg-[#151D3F] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2 shadow-xs cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
