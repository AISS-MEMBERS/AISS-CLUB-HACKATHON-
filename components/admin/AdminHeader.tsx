"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { performLogout } from "./api";

interface AdminHeaderProps {
  activeTab?: "dashboard" | "events" | "messages";
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const currentTab =
    activeTab ||
    (pathname === "/admin/events"
      ? "events"
      : pathname === "/admin/messages"
      ? "messages"
      : "dashboard");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      const result = await performLogout();
      if (result.success) {
        router.replace("/login");
        router.refresh();
      } else {
        setLogoutError(result.error.message);
      }
    } catch {
      setLogoutError("Çıkış yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#DCDDD3] bg-[#F5F3EC]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
          >
            <Image
              src="/students/nisa/club-logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-contain"
            />
            <div>
              <span className="block text-base font-extrabold tracking-tight text-[#1E2A5A]">
                AISS CLUB
              </span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Yönetim Paneli
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Yönetim Menüsü" className="flex items-center gap-2">
          <Link
            href="/admin"
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A] ${
              currentTab === "dashboard"
                ? "bg-[#1E2A5A] text-white"
                : "text-stone-700 hover:bg-[#DCDDD3]/50 hover:text-[#171916]"
            }`}
          >
            Genel Bakış
          </Link>
          <Link
            href="/admin/events"
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A] ${
              currentTab === "events"
                ? "bg-[#1E2A5A] text-white"
                : "text-stone-700 hover:bg-[#DCDDD3]/50 hover:text-[#171916]"
            }`}
          >
            Etkinlikler
          </Link>
          <Link
            href="/admin/messages"
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A] ${
              currentTab === "messages"
                ? "bg-[#1E2A5A] text-white"
                : "text-stone-700 hover:bg-[#DCDDD3]/50 hover:text-[#171916]"
            }`}
          >
            Mesajlar
          </Link>
        </nav>

        {/* Action buttons: View site & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
          >
            <span>Siteyi Gör</span>
            <svg
              className="h-3.5 w-3.5 text-stone-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 rounded-md bg-stone-800 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-stone-900 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
          >
            {isLoggingOut ? "Çıkılıyor..." : "Çıkış Yap"}
          </button>
        </div>
      </div>
      {logoutError && (
        <div className="border-t border-rose-200 bg-rose-50 px-4 py-1 text-center text-xs text-rose-700">
          {logoutError}
        </div>
      )}
    </header>
  );
}
