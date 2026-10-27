"use client";

import React, { useCallback, useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import MessageDetailModal from "@/components/admin/MessageDetailModal";
import MessageList from "@/components/admin/MessageList";
import { fetchAdminMessages, updateMessageStatus } from "@/components/admin/api";
import { ContactMessage, MessageStatus } from "@/components/admin/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected message for detail modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMessages = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchAdminMessages(targetPage);
      if (result.success) {
        setMessages(result.data.items);
        setPage(result.data.page);
      } else {
        // Never substitute fixture data for a failed live request.
        setErrorMessage(result.error.message);
      }
    } catch {
      setErrorMessage("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const result = await fetchAdminMessages(1);
        if (ignore) return;
        if (result.success) {
          setMessages(result.data.items);
          setPage(result.data.page);
        } else {
          setErrorMessage(result.error.message);
        }
      } catch {
        if (ignore) return;
        setErrorMessage("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
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

  const handleViewDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: MessageStatus) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const previousMessages = [...messages];
    try {
      const result = await updateMessageStatus(id, newStatus);
      if (result.success) {
        setSuccessMessage(`Mesaj durumu "${newStatus}" olarak güncellendi.`);
        await loadMessages(page);
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(result.data);
        }
      } else {
        setMessages(previousMessages);
        setErrorMessage(`Durum güncellenemedi: ${result.error.message}`);
      }
    } catch (err: unknown) {
      setMessages(previousMessages);
      const msg = err instanceof Error ? err.message : "Bağlantı hatası.";
      setErrorMessage(`Hata: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#171916]">
      <AdminHeader activeTab="messages" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2A5A] sm:text-3xl">
            Gelen İletişim Mesajları
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Ziyaretçilerden gelen mesajları inceleyin, durumlarını güncelleyin ve arşivleyin.
          </p>
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
              <p className="mt-3 text-xs font-semibold text-stone-600">Mesajlar yükleniyor...</p>
            </div>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              onViewDetail={handleViewDetail}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between border-t border-[#DCDDD3] pt-4 text-xs font-medium text-stone-600">
              <div>Sayfa: {page}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => loadMessages(page - 1)}
                  className="rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] disabled:opacity-40"
                >
                  Önceki
                </button>
                <button
                  type="button"
                  disabled={messages.length < 20 || isLoading}
                  onClick={() => loadMessages(page + 1)}
                  className="rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] disabled:opacity-40"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </>
        )}

        {/* Message Detail Modal */}
        <MessageDetailModal
          isOpen={isModalOpen}
          message={selectedMessage}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMessage(null);
          }}
          onStatusChange={async (id, status) => {
            await handleStatusChange(id, status);
          }}
        />
      </main>
    </div>
  );
}
