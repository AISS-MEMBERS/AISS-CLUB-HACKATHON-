"use client";

import React, { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DemoBanner from "@/components/admin/DemoBanner";
import EventFormModal from "@/components/admin/EventFormModal";
import EventList from "@/components/admin/EventList";
import {
  createAdminEvent,
  fetchAdminEvents,
  updateAdminEvent,
} from "@/components/admin/api";
import { DEMO_EVENTS } from "@/components/admin/fixtures";
import { ClubEvent, EventWriteInput, PublicationStatus } from "@/components/admin/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);

  const loadEvents = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchAdminEvents(targetPage);
      if (result.success) {
        setEvents(result.data.items);
        setPage(result.data.page);
        setIsDemoMode(false);
      } else {
        // If API is not available (404, 503, NETWORK_ERROR), switch to DEMO fixtures
        setIsDemoMode(true);
        setEvents(DEMO_EVENTS);
        setPage(targetPage);
      }
    } catch {
      setIsDemoMode(true);
      setEvents(DEMO_EVENTS);
      setPage(targetPage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const result = await fetchAdminEvents(1);
        if (ignore) return;
        if (result.success) {
          setEvents(result.data.items);
          setPage(result.data.page);
          setIsDemoMode(false);
        } else {
          setIsDemoMode(true);
          setEvents(DEMO_EVENTS);
          setPage(1);
        }
      } catch {
        if (ignore) return;
        setIsDemoMode(true);
        setEvents(DEMO_EVENTS);
        setPage(1);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: ClubEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (
    data: EventWriteInput
  ): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }> => {
    setSuccessMessage(null);

    if (isDemoMode) {
      return {
        success: false,
        error:
          "DEMO modu: Arka uç API henüz bu dala entegre edilmediğinden oluşturma/güncelleme yapılamaz. Veritabanı bağlandığında canlı API çağrılacaktır.",
      };
    }

    try {
      if (editingEvent) {
        const result = await updateAdminEvent(editingEvent.id, data);
        if (result.success) {
          setSuccessMessage(`"${result.data.title}" başarıyla güncellendi.`);
          await loadEvents(page);
          return { success: true };
        } else {
          return {
            success: false,
            error: result.error.message,
            fieldErrors: result.error.fieldErrors,
          };
        }
      } else {
        const result = await createAdminEvent(data);
        if (result.success) {
          setSuccessMessage(`"${result.data.title}" başarıyla oluşturuldu.`);
          await loadEvents(1);
          return { success: true };
        } else {
          return {
            success: false,
            error: result.error.message,
            fieldErrors: result.error.fieldErrors,
          };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İşlem sırasında beklenmedik bir hata oluştu.";
      return { success: false, error: msg };
    }
  };

  const handleStatusChange = async (id: string, status: PublicationStatus) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (isDemoMode) {
      setErrorMessage(
        "DEMO modu: Arka uç API entegrasyonu tamamlanana kadar durum değişiklikleri sunucuya kalıcı olarak yazılamaz (sahte setTimeout ile kaydedildi gösterilmez)."
      );
      return;
    }

    // Preserve previous state in case update fails
    const previousEvents = [...events];
    try {
      const result = await updateAdminEvent(id, { publicationStatus: status });
      if (result.success) {
        setSuccessMessage(`Etkinlik durumu "${status}" olarak güncellendi.`);
        await loadEvents(page);
      } else {
        setEvents(previousEvents);
        setErrorMessage(`Durum güncellenemedi: ${result.error.message}`);
      }
    } catch (err: unknown) {
      setEvents(previousEvents);
      const msg = err instanceof Error ? err.message : "Bağlantı hatası.";
      setErrorMessage(`Hata: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#171916]">
      <AdminHeader activeTab="events" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {isDemoMode && (
          <DemoBanner message="Etkinlikler API'si (/api/admin/events) henüz hazır olmadığından veriler test fixtures ile görüntülenmektedir" />
        )}

        {/* Page title & Create button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2A5A] sm:text-3xl">
              Etkinlik Yönetimi
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Kulüp etkinliklerini oluşturun, yayın durumunu yönetin ve arşivleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1E2A5A] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A5A]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Etkinlik Oluştur
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 text-xs font-bold"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Content list or Loading skeleton */}
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-[#DCDDD3] bg-white p-8">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DCDDD3] border-t-[#1E2A5A]" />
              <p className="mt-3 text-xs font-semibold text-stone-600">Etkinlikler yükleniyor...</p>
            </div>
          </div>
        ) : (
          <>
            <EventList
              events={events}
              onEdit={handleOpenEditModal}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between border-t border-[#DCDDD3] pt-4 text-xs font-medium text-stone-600">
              <div>Sayfa: {page}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => loadEvents(page - 1)}
                  className="rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] disabled:opacity-40"
                >
                  Önceki
                </button>
                <button
                  type="button"
                  disabled={events.length < 20 || isLoading}
                  onClick={() => loadEvents(page + 1)}
                  className="rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] disabled:opacity-40"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </>
        )}

        {/* Event Form Modal */}
        <EventFormModal
          isOpen={isModalOpen}
          event={editingEvent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleModalSubmit}
        />
      </main>
    </div>
  );
}
