"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
] as const;

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#DCDDD3] bg-[#F5F3EC]/95 text-[#1E2A5A] backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileMenuOpen) {
          setMobileMenuOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-[#1E2A5A] focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <nav aria-label="Main navigation" className="relative">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <a
            href="#home"
            aria-label="AISS Club home"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              window.history.scrollRestoration = "manual";
              window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
              window.location.reload();
            }}
            className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2A5A]"
          >
            <Image
              src="/students/nisa/club-logo.png"
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 rounded-full object-contain sm:h-16 sm:w-16"
            />
            <span className="text-base font-extrabold tracking-tight sm:text-lg">
              AISS CLUB
            </span>
          </a>
          <div className="hidden items-center gap-6 md:flex lg:gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-bold transition-colors hover:text-[#171916] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2A5A] lg:text-base"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-[#DCDDD3]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A] md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <div
          id="mobile-navigation"
          hidden={!mobileMenuOpen}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-[#DCDDD3] bg-[#F5F3EC] shadow-sm md:hidden"
        >
          <div className="site-container grid gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 font-bold hover:bg-[#DCDDD3]/40 focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
