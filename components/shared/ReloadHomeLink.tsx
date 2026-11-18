"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ReloadHomeLinkProps {
  children: ReactNode;
  ariaLabel?: string;
}

export default function ReloadHomeLink({ children, ariaLabel }: ReloadHomeLinkProps) {
  const { t } = useLanguage();

  return (
    <Link
      href="/"
      aria-label={ariaLabel || t.nav.clubLogoAria}
      className="inline-flex shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2A5A]"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (window.location.pathname !== "/") return;
        event.preventDefault();
        window.history.scrollRestoration = "manual";
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
        window.location.reload();
      }}
    >
      {children}
    </Link>
  );
}
