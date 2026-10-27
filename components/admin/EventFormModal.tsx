"use client";

import React, { useState } from "react";
import EventCoverPicker from "./EventCoverPicker";
import {
  ClubEvent,
  EventCategory,
  EventWriteInput,
  PublicationStatus,
} from "./types";
import {
  TIMEZONE_LABEL,
  isoToIstanbulDatetimeLocal,
  istanbulDatetimeLocalToIso,
} from "./timezone";

interface EventFormModalProps {
  event?: ClubEvent | null; // null if creating
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventWriteInput) => Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string> }>;
}

export default function EventFormModal({
  event,
  isOpen,
  onClose,
  onSubmit,
}: EventFormModalProps) {
  const isEditing = Boolean(event);

  // Form state
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [category, setCategory] = useState<EventCategory>(event?.category ?? "WORKSHOP");
  const [startsAtLocal, setStartsAtLocal] = useState(
    event ? isoToIstanbulDatetimeLocal(event.startsAt) : ""
  );
  const [endsAtLocal, setEndsAtLocal] = useState(
    event ? isoToIstanbulDatetimeLocal(event.endsAt) : ""
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [lead, setLead] = useState(event?.lead ?? "");
  const [imagePath, setImagePath] = useState(event?.imagePath ?? "");
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>(
    event?.publicationStatus ?? "draft"
  );
  const [isFeatured, setIsFeatured] = useState(event?.isFeatured ?? false);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || isSubmitting) return;
    setGeneralError(null);
    setFieldErrors({});

    // Client-side quick validation to assist user before network call
    const errors: Record<string, string> = {};
    if (title.trim().length < 3 || title.trim().length > 160) {
      errors.title = "Başlık 3 ile 160 karakter arasında olmalıdır.";
    }
    if (description.trim().length < 10 || description.trim().length > 3000) {
      errors.description = "Açıklama 10 ile 3000 karakter arasında olmalıdır.";
    }

    const isoStartsAt = istanbulDatetimeLocalToIso(startsAtLocal);
    if (!isoStartsAt) {
      errors.startsAt = "Lütfen geçerli bir başlangıç tarihi ve saati girin.";
    }

    let isoEndsAt: string | null = null;
    if (endsAtLocal.trim()) {
      isoEndsAt = istanbulDatetimeLocalToIso(endsAtLocal);
      if (!isoEndsAt) {
        errors.endsAt = "Geçersiz bitiş tarihi.";
      } else if (isoStartsAt && new Date(isoEndsAt) <= new Date(isoStartsAt)) {
        errors.endsAt = "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Prepare strictly aligned EventWriteInput (nulls remain null rather than empty string or arbitrary values)
    const payload: EventWriteInput = {
      title: title.trim(),
      description: description.trim(),
      category,
      startsAt: isoStartsAt!,
      endsAt: isoEndsAt,
      location: location.trim() ? location.trim() : null,
      lead: lead.trim() ? lead.trim() : null,
      imagePath: imagePath.trim() ? imagePath.trim() : null,
      publicationStatus,
      isFeatured,
    };

    setIsSubmitting(true);
    try {
      const result = await onSubmit(payload);
      if (result.success) {
        onClose();
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        if (result.error) {
          setGeneralError(result.error);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Beklenmedik bir hata oluştu.";
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-[#DCDDD3] bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#DCDDD3] pb-4">
          <h2 id="modal-title" className="text-xl font-bold text-[#1E2A5A]">
            {isEditing ? "Etkinliği Düzenle" : "Yeni Etkinlik Oluştur"}
          </h2>
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

        {generalError && (
          <div
            role="alert"
            className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
          >
            <span className="font-semibold">Hata: </span>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="event-title" className="block text-xs font-bold uppercase text-stone-700">
              Etkinlik Başlığı <span className="text-rose-600">*</span>
            </label>
            <input
              id="event-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Yapay Zeka Etiği ve Hukuk"
              className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] placeholder-stone-400 focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="event-category" className="block text-xs font-bold uppercase text-stone-700">
              Kategori <span className="text-rose-600">*</span>
            </label>
            <select
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
            >
              <option value="WORKSHOP">WORKSHOP (Atölye)</option>
              <option value="TALK">TALK (Konferans / Söyleşi)</option>
              <option value="BUILD SESSION">BUILD SESSION (Geliştirme Oturumu)</option>
            </select>
            {fieldErrors.category && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="event-description" className="block text-xs font-bold uppercase text-stone-700">
              Açıklama <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="event-description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Etkinlik detayları, katılım şartları ve içerik..."
              className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] placeholder-stone-400 focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* Dates & Timezone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="event-starts-at" className="block text-xs font-bold uppercase text-stone-700">
                  Başlangıç Tarihi <span className="text-rose-600">*</span>
                </label>
                <span className="text-[11px] font-semibold text-[#1E2A5A]" title={TIMEZONE_LABEL}>
                  Europe/Istanbul
                </span>
              </div>
              <input
                id="event-starts-at"
                type="datetime-local"
                required
                value={startsAtLocal}
                onChange={(e) => setStartsAtLocal(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
              />
              <p className="mt-1 text-[11px] text-stone-500">Saat dilimi: {TIMEZONE_LABEL}</p>
              {fieldErrors.startsAt && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.startsAt}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="event-ends-at" className="block text-xs font-bold uppercase text-stone-700">
                  Bitiş Tarihi (Opsiyonel)
                </label>
                <span className="text-[11px] font-semibold text-[#1E2A5A]" title={TIMEZONE_LABEL}>
                  Europe/Istanbul
                </span>
              </div>
              <input
                id="event-ends-at"
                type="datetime-local"
                value={endsAtLocal}
                onChange={(e) => setEndsAtLocal(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
              />
              <p className="mt-1 text-[11px] text-stone-500">Boş bırakılırsa süre belirtilmez.</p>
              {fieldErrors.endsAt && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.endsAt}</p>
              )}
            </div>
          </div>

          {/* Location & Lead */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="event-location" className="block text-xs font-bold uppercase text-stone-700">
                Konum / Mekan
              </label>
              <input
                id="event-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Örn: Bilgisayar Lab 2 veya Çevrim içi"
                className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] placeholder-stone-400 focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
              />
              {fieldErrors.location && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.location}</p>
              )}
            </div>

            <div>
              <label htmlFor="event-lead" className="block text-xs font-bold uppercase text-stone-700">
                Konuşmacı / Kolaylaştırıcı
              </label>
              <input
                id="event-lead"
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="Örn: Dr. Ayşe Yılmaz"
                className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] placeholder-stone-400 focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
              />
              {fieldErrors.lead && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.lead}</p>
              )}
            </div>
          </div>

          <EventCoverPicker value={imagePath} onChange={setImagePath} onBusyChange={setIsUploading} />
          {fieldErrors.imagePath && <p role="alert" className="text-sm text-rose-600">{fieldErrors.imagePath}</p>}

          {/* Publication Status & Featured Flag */}
          <div className="grid gap-4 rounded-lg border border-[#DCDDD3] bg-[#F5F3EC]/50 p-4 sm:grid-cols-2">
            <div>
              <label htmlFor="event-status" className="block text-xs font-bold uppercase text-stone-700">
                Yayın Durumu
              </label>
              <select
                id="event-status"
                value={publicationStatus}
                onChange={(e) => setPublicationStatus(e.target.value as PublicationStatus)}
                className="mt-1 block w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm text-[#171916] focus:border-[#1E2A5A] focus:outline-hidden focus:ring-1 focus:ring-[#1E2A5A]"
              >
                <option value="draft">Taslak (draft) - Sitede görünmez</option>
                <option value="published">Yayınlandı (published) - Ziyaretçilere açık</option>
                <option value="archived">Arşivlendi (archived) - Siteden kaldırıldı</option>
              </select>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#1E2A5A] focus:ring-[#1E2A5A]"
                />
                <span className="text-sm font-semibold text-stone-800">
                  Öne Çıkarılmış Etkinlik (Featured)
                </span>
              </label>
              <p className="mt-1 text-[11px] text-stone-500">
                Veritabanı kuralı: Aynı anda yalnızca bir etkinlik yayında ve öne çıkarılmış olabilir.
              </p>
              {fieldErrors.isFeatured && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.isFeatured}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#DCDDD3] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="rounded-md border border-[#DCDDD3] bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-2xs hover:bg-[#F5F3EC] disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="rounded-md bg-[#1E2A5A] px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#2b3c7d] disabled:opacity-50"
            >
              {isSubmitting ? "Kaydediliyor..." : isEditing ? "Değişiklikleri Kaydet" : "Etkinliği Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
