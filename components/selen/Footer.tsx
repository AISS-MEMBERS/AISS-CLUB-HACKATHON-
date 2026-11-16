"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReloadHomeLink from "@/components/shared/ReloadHomeLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "/#home" },
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.events, href: "/#events" },
    { label: t.nav.team, href: "/#team" },
    { label: t.nav.contact, href: "/#contact" },
    { label: t.nav.joinClub, href: "/join" },
  ] as const;

  return (
    <footer
      id="footer"
      aria-label="Site Footer"
      className="w-full border-t border-[#DCDDD3] bg-[#d8d9de] py-10 text-[#1E2A5A] sm:py-14"
    >
      <div className="site-container">
      {/* Top & Navigation Section */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {/* Club Identity */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <ReloadHomeLink>
            <Image
              src="/students/selen/aiss-logo.png"
              alt={t.footer.logoAlt}
              width={60}
              height={60}
              className="h-[45px] w-[45px] shrink-0 rounded-full object-contain md:h-[60px] md:w-[60px]"
            />
            </ReloadHomeLink>
            <h2 className="text-xl font-bold tracking-tight text-[#1E2A5A] sm:text-2xl md:text-3xl">
              {t.footer.clubTitle}
            </h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#1E2A5A] sm:text-base">
            {t.footer.clubDesc}
          </p>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Footer Navigation">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center text-[#1E2A5A] transition-colors duration-300 hover:text-[#4169E1] focus-visible:text-[#4169E1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171916] rounded-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Subtle Divider */}
      <div className="my-8 border-t border-[#d8d9de]" />

      {/* Bottom Section: Copyright & Back to Top */}
      <div className="flex flex-col items-center justify-between gap-4 text-xs font-mono text-[#1E2A5A] sm:flex-row">
        <p className="font-['Bricolage_Grotesque',sans-serif] text-[#1E2A5A]">
          {t.footer.copyright}
        </p>

        <Link
          href="/#home"
          aria-label={t.footer.backToTop}
          className="group inline-flex min-h-[44px] items-center gap-1.5 text-[#1E2A5A] transition-colors duration-300 hover:text-[#4169E1] focus-visible:text-[#4169E1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171916] rounded-sm"
        >
          <span>{t.footer.backToTop}</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:-translate-y-0.5"
          >
            &uarr;
          </span>
        </Link>
      </div>
      </div>
    </footer>
  );
}
