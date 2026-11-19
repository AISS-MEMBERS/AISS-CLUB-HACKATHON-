"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#1E2A5A]">
        {t.notFound.errorCode}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#1E2A5A] sm:text-5xl">
        {t.notFound.title}
      </h1>
      <p className="mt-4 max-w-md text-base text-[#1E2A5A]/80">
        {t.notFound.description}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-[#1E2A5A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#283875] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
      >
        {t.notFound.returnHome}
      </Link>
    </main>
  );
}
