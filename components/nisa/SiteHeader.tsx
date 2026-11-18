"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "/#home" },
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.events, href: "/#events" },
    { label: t.nav.team, href: "/#team" },
    { label: t.nav.contact, href: "/#contact" },
  ] as const;

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
        {t.nav.skipToContent}
      </a>
      <nav aria-label={t.nav.mainNavigationAria} className="relative">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={t.nav.clubLogoAria}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              if (window.location.pathname !== "/") return;
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
            <span className="hidden text-base font-extrabold sm:block tracking-tight sm:text-lg">
              AISS CLUB
            </span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex lg:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-bold transition-colors hover:text-[#171916] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2A5A] lg:text-base"
              >
                {link.label}
              </a>
            ))}
            <LanguageSwitcher className="ml-2" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/join"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-[#1E2A5A] px-3 text-xs font-bold text-white hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-4 sm:px-4 sm:text-sm"
            >
              {t.nav.joinClub}
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-[#DCDDD3]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="mobile-navigation"
          hidden={!mobileMenuOpen}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-[#DCDDD3] bg-[#F5F3EC] shadow-sm lg:hidden"
        >
          <div className="site-container grid gap-1 py-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 font-bold hover:bg-[#DCDDD3]/40 focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-[#DCDDD3] px-3 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E2A5A]">
                {t.nav.languageAriaLabel}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
