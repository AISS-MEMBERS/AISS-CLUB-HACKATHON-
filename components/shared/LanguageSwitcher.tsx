"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.nav.languageAriaLabel}
      className={`inline-flex items-center rounded-full border border-[#DCDDD3] bg-white/80 p-0.5 shadow-2xs backdrop-blur-xs transition-colors ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label={t.nav.switchToEn}
        className={`inline-flex min-h-[30px] min-w-[34px] items-center justify-center rounded-full px-2.5 text-xs font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1E2A5A] cursor-pointer ${
          locale === "en"
            ? "bg-[#1E2A5A] text-white shadow-xs"
            : "text-[#55574E] hover:text-[#1E2A5A] hover:bg-[#DCDDD3]/30"
        }`}
      >
        EN
      </button>
      <span className="text-[#DCDDD3] select-none text-xs" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale("tr")}
        aria-pressed={locale === "tr"}
        aria-label={t.nav.switchToTr}
        className={`inline-flex min-h-[30px] min-w-[34px] items-center justify-center rounded-full px-2.5 text-xs font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1E2A5A] cursor-pointer ${
          locale === "tr"
            ? "bg-[#1E2A5A] text-white shadow-xs"
            : "text-[#55574E] hover:text-[#1E2A5A] hover:bg-[#DCDDD3]/30"
        }`}
      >
        TR
      </button>
    </div>
  );
}
