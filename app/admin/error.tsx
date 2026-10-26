"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to client console without exposing secrets or personal data
    console.error("Admin route error caught:", error.message);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center"
    >
      <div className="mx-auto max-w-md rounded-xl border border-rose-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-lg font-bold text-[#1E2A5A]">Bir Sorun Oluştu</h2>
        <p className="mt-2 text-sm text-stone-600">
          Yönetim paneli yüklenirken bir hata meydana geldi. Bu durum geçici bir servis veya bağlantı probleminden kaynaklanıyor olabilir.
        </p>

        {error.message && (
          <div className="mt-3 rounded-md bg-stone-50 p-2 text-xs font-mono text-stone-700">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex justify-center rounded-md bg-[#1E2A5A] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
          >
            Tekrar Dene
          </button>
          <Link
            href="/admin"
            className="inline-flex justify-center rounded-md border border-[#DCDDD3] bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
          >
            Yönetim Ana Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
