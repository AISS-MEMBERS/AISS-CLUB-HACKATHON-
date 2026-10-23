"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const SWIPE_THRESHOLD = 48;
const INTERACTIVE = "a, button, input, textarea, select, [contenteditable], [data-native-scroll]";
let pinnedTrack: HTMLElement | null = null;

function getActiveTrack(): HTMLElement | null {
  return pinnedTrack;
}

function getStops(track: HTMLElement): number[] {
  const cards = Array.from(track.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  );
  const first = cards[0]?.offsetLeft ?? 0;
  const limit = track.scrollWidth - track.clientWidth;
  const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  return cards.map((card) => {
    const centerOffset = getComputedStyle(card).scrollSnapAlign === "center"
      ? (card.offsetWidth - track.clientWidth) / 2
      : 0;
    return Math.max(0, Math.min(limit, card.offsetLeft - first + padding + centerOffset));
  });
}

interface CarouselNavigation {
  index?: number;
  onSelect?: (index: number) => void;
}

export function useMobileCardCarousel<T extends HTMLElement>(count: number, navigation?: CarouselNavigation) {
  const trackRef = useRef<T>(null);
  const indexRef = useRef(0);
  const programmaticRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = navigation?.index;
  const onSelect = navigation?.onSelect;

  useEffect(() => {
    if (selectedIndex !== undefined) indexRef.current = selectedIndex;
  }, [selectedIndex]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track || count < 1) return;
    const next = Math.max(0, Math.min(count - 1, index));
    if (onSelect) {
      indexRef.current = next;
      setActiveIndex(next);
      onSelect(next);
      return;
    }
    const left = getStops(track)[next];
    if (left === undefined) return;

    indexRef.current = next;
    programmaticRef.current = true;
    setActiveIndex(next);
    track.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [count, onSelect]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let gesture: { x: number; y: number; direction: number; captured: boolean } | null = null;
    let frame = 0;
    let wheelLocked = false;
    let wheelDistance = 0;
    let wheelDirection = 0;
    let wheelTimer = 0;
    let restorePage: (() => void) | null = null;
    let releasedDirection = 0;
    let previousY = window.scrollY;

    const release = (direction = 0) => {
      releasedDirection = direction;
      const restore = restorePage;
      restorePage = null;
      if (pinnedTrack === track) pinnedTrack = null;
      restore?.();
      previousY = window.scrollY;
    };

    const pinOnEntry = () => {
      if (pinnedTrack || count < 2 || !window.matchMedia(MOBILE_QUERY).matches) return;
      const y = window.scrollY;
      const direction = Math.sign(y - previousY);
      previousY = y;
      const rect = track.getBoundingClientRect();
      // Leave enough room for the fixed header and the whole card. Tall,
      // expanded content keeps ordinary page scrolling.
      if (!direction || rect.height > window.innerHeight - 112 || rect.height <= 0) return;
      const top = Math.max(96, (window.innerHeight + 80 - rect.height) / 2);
      if (releasedDirection === direction) {
        if (Math.abs(rect.top - top) > 100) releasedDirection = 0;
        return;
      }
      if (indexRef.current + direction < 0 || indexRef.current + direction >= count) return;
      if (direction > 0 ? rect.top > top || rect.bottom < 96 : rect.top < top || rect.top > window.innerHeight) return;

      const root = document.documentElement;
      const body = document.body;
      const savedBody = { position: body.style.position, top: body.style.top,
        left: body.style.left, right: body.style.right, width: body.style.width };
      const savedOverflow = root.style.overflow;
      const savedBehavior = root.style.scrollBehavior;
      const anchor = Math.max(0, y + rect.top - top);
      pinnedTrack = track;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: anchor, behavior: "instant" });
      body.style.position = "fixed";
      body.style.top = `${-anchor}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      root.style.overflow = "hidden";
      restorePage = () => {
        Object.assign(body.style, savedBody);
        root.style.overflow = savedOverflow;
        window.scrollTo({ top: anchor, behavior: "instant" });
        root.style.scrollBehavior = savedBehavior;
      };
    };

    const onResize = () => { release(); };
    const onNavigate = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a[href]")) release();
    };

    const resetWheel = () => {
      wheelLocked = false;
      wheelDistance = 0;
      wheelDirection = 0;
    };

    const extendWheelGesture = () => {
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(resetWheel, 220);
    };

    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia(MOBILE_QUERY).matches || event.defaultPrevented ||
          Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (event.target instanceof Element &&
          event.target.closest("input, textarea, select, [contenteditable], [data-native-scroll]")) return;
      if (wheelLocked) {
        if (event.cancelable) event.preventDefault();
        extendWheelGesture();
        return;
      }
      if (getActiveTrack() !== track || !event.cancelable) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const next = indexRef.current + direction;
      if (next < 0 || next >= count) { release(direction); return; }

      event.preventDefault();
      if (direction !== wheelDirection) wheelDistance = 0;
      wheelDirection = direction;
      const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      wheelDistance += Math.abs(event.deltaY) * multiplier;
      extendWheelGesture();
      if (wheelDistance >= SWIPE_THRESHOLD) {
        wheelLocked = true;
        goTo(next);
      }
    };

    const syncIndex = () => {
      frame = 0;
      if (onSelect || programmaticRef.current || !window.matchMedia(MOBILE_QUERY).matches) return;
      const stops = getStops(track);
      let nearest = 0;
      for (let index = 1; index < stops.length; index++) {
        if (Math.abs(stops[index] - track.scrollLeft) < Math.abs(stops[nearest] - track.scrollLeft)) {
          nearest = index;
        }
      }
      indexRef.current = nearest;
      setActiveIndex(nearest);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncIndex);
    };

    const onStart = (event: TouchEvent) => {
      gesture = null;
      if (!window.matchMedia(MOBILE_QUERY).matches || event.touches.length !== 1 || count < 2) return;
      if (event.target instanceof Element && event.target.closest(INTERACTIVE)) return;
      if (getActiveTrack() !== track) return;
      const touch = event.touches[0];
      gesture = { x: touch.clientX, y: touch.clientY, direction: 0, captured: false };
    };

    const onMove = (event: TouchEvent) => {
      if (!gesture) return;
      if (event.touches.length !== 1) {
        gesture = null;
        return;
      }
      const touch = event.touches[0];
      const dx = touch.clientX - gesture.x;
      const dy = touch.clientY - gesture.y;

      if (gesture.captured) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        programmaticRef.current = false;
        gesture = null;
        return;
      }
      if (dy === 0) return;

      // Finger up scrolls the page down: advance one card toward the right.
      const direction = dy < 0 ? 1 : -1;
      const next = indexRef.current + direction;
      if (next < 0 || next >= count || !event.cancelable) {
        if (next < 0 || next >= count) release(direction);
        gesture = null;
        return;
      }
      gesture.direction = direction;
      gesture.captured = true;
      event.preventDefault();
    };

    const onEnd = (event: TouchEvent) => {
      const finished = gesture;
      gesture = null;
      if (!finished?.captured || event.touches.length !== 0) return;
      if (event.cancelable) event.preventDefault();
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - finished.x;
      const dy = touch.clientY - finished.y;
      if (Math.abs(dy) < SWIPE_THRESHOLD || Math.abs(dy) <= Math.abs(dx) * 1.15) return;
      if ((dy < 0 ? 1 : -1) !== finished.direction) return;
      goTo(indexRef.current + finished.direction);
    };

    const onCancel = () => { gesture = null; };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: false });
    window.addEventListener("touchcancel", onCancel, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", pinOnEntry, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("click", onNavigate);
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onCancel);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", pinOnEntry);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onNavigate);
      release();
      track.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(wheelTimer);
    };
  }, [count, goTo, onSelect]);

  return { trackRef, activeIndex, goTo };
}

interface MobileCardCarouselProps {
  children: ReactNode;
  count: number;
  label: string;
  className: string;
}

export default function MobileCardCarousel({ children, count, label, className }: MobileCardCarouselProps) {
  const { trackRef, activeIndex, goTo } = useMobileCardCarousel<HTMLOListElement>(count);
  return (
    <div>
      <ol
        ref={trackRef}
        tabIndex={0}
        aria-label={label}
        className={className}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget || !window.matchMedia(MOBILE_QUERY).matches) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        {children}
      </ol>
    </div>
  );
}
