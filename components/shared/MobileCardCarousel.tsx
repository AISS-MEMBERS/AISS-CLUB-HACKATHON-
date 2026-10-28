"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const clamp = (value: number, maximum: number) => Math.max(0, Math.min(maximum, value));

interface Measurements {
  pinned: boolean;
  distance: number;
  top: number;
  width: number;
  stops: number[];
}

/** Native vertical scrolling drives a sticky horizontal viewport. Never locks the page. */
export function useMobileCardCarousel<T extends HTMLElement>(count: number) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<T>(null);
  const measurements = useRef<Measurements>({ pinned: false, distance: 0, top: 0, width: 0, stops: [] });
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    if (!track || !scene || count < 1) return;
    const next = clamp(index, count - 1);
    const geometry = measurements.current;
    const left = geometry.stops[next] ?? 0;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (geometry.pinned) {
      window.scrollTo({ top: window.scrollY + scene.getBoundingClientRect().top - geometry.top + left, behavior });
    } else {
      track.scrollTo({ left, behavior });
    }
  }, [count]);

  useEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!scene || !stage || !track) return;

    const mobile = window.matchMedia(MOBILE_QUERY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let measureFrame = 0;
    const cards = () => Array.from(track.children).filter((child): child is HTMLElement => child instanceof HTMLElement);

    const selectNearest = () => {
      const stops = measurements.current.stops;
      let nearest = 0;
      for (let index = 1; index < stops.length; index++) {
        if (Math.abs(stops[index] - track.scrollLeft) < Math.abs(stops[nearest] - track.scrollLeft)) nearest = index;
      }
      cards().forEach((card, index) => { card.dataset.cardActive = String(index === nearest); });
      if (nearest !== indexRef.current) {
        indexRef.current = nearest;
        setActiveIndex(nearest);
      }
    };

    const sync = () => {
      frame = 0;
      const geometry = measurements.current;
      if (geometry.pinned) {
        const offset = geometry.top - scene.getBoundingClientRect().top;
        track.scrollLeft = clamp(offset, geometry.distance);
      }
      selectNearest();
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };

    const measure = () => {
      measureFrame = 0;
      const previous = measurements.current;
      const rect = scene.getBoundingClientRect();
      const oldProgress = previous.distance > 0 ? (previous.top - rect.top) / previous.distance : -1;
      const children = cards();
      const distance = Math.max(0, track.scrollWidth - track.clientWidth);
      const height = stage.getBoundingClientRect().height;
      const viewportHeight = document.documentElement.clientHeight;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height"));
      // The token is in rem. Measure the actual root font instead of assuming 16px.
      const token = getComputedStyle(document.documentElement).getPropertyValue("--site-header-height").trim();
      const headerHeight = token.endsWith("rem") ? header * parseFloat(getComputedStyle(document.documentElement).fontSize) : header;
      const minimumTop = (Number.isFinite(headerHeight) ? headerHeight : 80) + 16;
      const top = Math.max(minimumTop, (viewportHeight - height) / 2);
      // Tall/expanded cards and short landscape screens use ordinary native scrolling.
      const pinned = mobile.matches && !reduced.matches && children.length > 1 && distance > 1 && height > 0 && height + minimumTop + 16 <= viewportHeight;
      const first = children[0]?.offsetLeft ?? 0;
      const stops = children.map((card) => clamp(card.offsetLeft - first, distance));
      measurements.current = { pinned, distance, top, width: track.clientWidth, stops };
      scene.dataset.scrollMode = pinned ? "pinned" : "native";
      scene.style.height = pinned ? `${height + distance}px` : "";
      stage.style.top = pinned ? `${top}px` : "";
      if (previous.pinned && pinned && oldProgress >= 0 && oldProgress <= 1 && Math.abs(previous.width - track.clientWidth) > 1) {
        // Keep the same progress on a width change; normal scrolling remains native.
        window.scrollTo({ top: window.scrollY + scene.getBoundingClientRect().top - top + oldProgress * distance, behavior: "instant" });
      }
      if (!mobile.matches) track.scrollLeft = 0;
      sync();
    };
    const scheduleMeasure = () => {
      if (!measureFrame) measureFrame = window.requestAnimationFrame(measure);
    };

    // Tab/arrow navigation must reveal off-screen cards as well as touch scrolling.
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!measurements.current.pinned || !(target instanceof Node)) return;
      const index = cards().findIndex((card) => card.contains(target));
      if (index >= 0) goTo(index);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(stage);
    observer.observe(track);
    const observeCards = () => {
      observer.disconnect();
      observer.observe(stage);
      observer.observe(track);
      cards().forEach((card) => observer.observe(card));
      scheduleMeasure();
    };
    const mutations = new MutationObserver(observeCards);
    mutations.observe(track, { childList: true });
    observeCards();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("pageshow", scheduleMeasure);
    track.addEventListener("scroll", schedule, { passive: true });
    track.addEventListener("focusin", onFocus);
    mobile.addEventListener("change", scheduleMeasure);
    reduced.addEventListener("change", scheduleMeasure);
    measure();
    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(measureFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("pageshow", scheduleMeasure);
      track.removeEventListener("scroll", schedule);
      track.removeEventListener("focusin", onFocus);
      mobile.removeEventListener("change", scheduleMeasure);
      reduced.removeEventListener("change", scheduleMeasure);
      scene.style.height = "";
      stage.style.top = "";
      delete scene.dataset.scrollMode;
      cards().forEach((card) => { delete card.dataset.cardActive; });
    };
  }, [count, goTo]);

  return { sceneRef, stageRef, trackRef, activeIndex, goTo };
}

interface MobileCardCarouselProps {
  children: ReactNode;
  count: number;
  label: string;
  className: string;
}

export default function MobileCardCarousel({ children, count, label, className }: MobileCardCarouselProps) {
  const { sceneRef, stageRef, trackRef, activeIndex, goTo } = useMobileCardCarousel<HTMLOListElement>(count);
  return (
    <div ref={sceneRef} data-card-scene>
      <div ref={stageRef} data-card-stage>
        <ol
          ref={trackRef}
          data-card-track
          tabIndex={0}
          aria-label={label}
          aria-roledescription="carousel"
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
    </div>
  );
}
