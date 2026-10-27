"use client";

import React from "react";
import { ContactMessage, MessageStatus } from "./types";
import StatusBadge from "./StatusBadge";
import { formatIstanbulDateTime, TIMEZONE_LABEL } from "./timezone";

interface MessageDetailModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: MessageStatus) => Promise<void>;
}

export default function MessageDetailModal({
  message,
  isOpen,
  onClose,
  onStatusChange,
}: MessageDetailModalProps) {
  if (!isOpen || !message) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-[#DCDDD3] bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#DCDDD3] pb-4">
          <div>
            <h2 id="message-detail-title" className="text-xl font-bold text-[#1E2A5A]">
              İletişim Mesajı Detayı
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Gönderilme: {formatIstanbulDateTime(message.createdAt)} ({TIMEZONE_LABEL})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sender Info Grid */}
        <div className="mt-4 grid gap-4 rounded-lg border border-[#DCDDD3] bg-[#F5F3EC]/50 p-4 sm:grid-cols-2">
          <div>
            <span className="block text-xs font-bold uppercase text-stone-500">Gönderen</span>
            <span className="mt-0.5 block font-semibold text-stone-900">{message.fullName}</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-stone-500">Üniversite E-postası</span>
            <span className="mt-0.5 block font-mono text-xs text-stone-900">{message.universityEmail}</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-stone-500">İlgi Alanı</span>
            <span className="mt-0.5 inline-block rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#1E2A5A] border border-[#DCDDD3]">
              {message.areaOfInterest}
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-stone-500">Durum</span>
            <div className="mt-1">
              <StatusBadge status={message.status} type="message" />
            </div>
          </div>
        </div>

        {/* Message Body (Rendered as text only, never executable HTML) */}
        <div className="mt-4">
          <label className="block text-xs font-bold uppercase text-stone-700">
            Mesaj İçeriği
          </label>
          <div className="mt-1.5 whitespace-pre-wrap rounded-lg border border-[#DCDDD3] bg-stone-50 p-4 text-sm leading-relaxed text-stone-800">
            {message.message}
          </div>
        </div>

        {/* External Mail Client Notice */}
        <div className="mt-4 rounded-md border border-stone-200 bg-stone-50/70 p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-800">E-posta Yanıtlama Bilgilendirmesi:</p>
          <p className="mt-0.5">
            Sözleşme gereği bu yönetim paneli doğrudan toplu veya otomatik e-posta gönderimi yapmaz. Aşağıdaki bağlantı cihazınızdaki yerel e-posta uygulamasını açacaktır.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCDDD3] pt-4">
          <a
            href={`mailto:${message.universityEmail}?subject=${encodeURIComponent(
              `AISS Club - ${message.areaOfInterest} hk.`
            )}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2A5A] shadow-2xs hover:bg-[#F5F3EC]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            E-posta Uygulamasıyla Yanıtla (Harici)
          </a>

          <div className="flex items-center gap-2">
            {message.status === "new" && (
              <button
                type="button"
                onClick={() => onStatusChange(message.id, "read")}
                className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
              >
                Okundu İşaretle
              </button>
            )}

            {message.status !== "archived" && (
              <button
                type="button"
                onClick={() => onStatusChange(message.id, "archived")}
                className="rounded-md border border-stone-300 bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200"
              >
                Arşivle
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#DCDDD3] bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC]"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
