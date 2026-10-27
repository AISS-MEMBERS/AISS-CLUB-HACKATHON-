"use client";

import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#171916]">
      <AdminHeader activeTab="dashboard" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2A5A] sm:text-3xl">
            Yönetim Paneli
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            AISS Club etkinliklerini ve iletişim formundan gelen ziyaretçi mesajlarını buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Management Module Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Events Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCDDD3] bg-white p-6 shadow-xs transition-shadow hover:shadow-md">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E2A5A]/10 text-[#1E2A5A]">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#1E2A5A]">Etkinlik Yönetimi</h2>
              <p className="mt-2 text-sm text-stone-600">
                Kulüp etkinliklerini oluşturun, güncelleyin, taslak olarak saklayın veya yayınlayın. Zaman dilimi Europe/Istanbul olarak işlenir.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/events"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#1E2A5A] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
              >
                Etkinlikleri Yönet
              </Link>
            </div>
          </div>

          {/* Messages Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCDDD3] bg-white p-6 shadow-xs transition-shadow hover:shadow-md">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E2A5A]/10 text-[#1E2A5A]">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#1E2A5A]">Gelen İletişim Mesajları</h2>
              <p className="mt-2 text-sm text-stone-600">
                Web sitesi iletişim formundan gelen öğrenci ve ziyaretçi mesajlarını inceleyin, okundu veya arşivlendi olarak işaretleyin.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/messages"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#1E2A5A] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
              >
                Mesajları İncele
              </Link>
            </div>
          </div>

          {/* Site Preview & System Rules Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCDDD3] bg-white p-6 shadow-xs transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#1E2A5A]">Güvenlik ve Standartlar</h2>
              <ul className="mt-2 space-y-1.5 text-xs text-stone-600">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E2A5A]" />
                  Zaman dilimi: <strong>Europe/Istanbul (TRT)</strong>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E2A5A]" />
                  Görseller: Hazır görseller veya cihazınızdan yüklenen kapaklar
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E2A5A]" />
                  Öne çıkarma: Aynı anda en fazla 1 yayınlanmış etkinlik
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E2A5A]" />
                  Yetkilendirme: Sunucu taraflı RLS ve oturum kontrolü
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-md border border-[#DCDDD3] bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-2xs hover:bg-[#F5F3EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
              >
                Canlı Web Sitesini Aç
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
