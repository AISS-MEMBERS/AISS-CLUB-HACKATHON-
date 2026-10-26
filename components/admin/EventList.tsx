"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClubEvent, PublicationStatus } from "./types";
import StatusBadge from "./StatusBadge";
import { formatIstanbulDateTime, TIMEZONE_LABEL } from "./timezone";

interface EventListProps {
  events: ClubEvent[];
  onEdit: (event: ClubEvent) => void;
  onStatusChange: (id: string, status: PublicationStatus) => Promise<void>;
}

export default function EventList({
  events,
  onEdit,
  onStatusChange,
}: EventListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#DCDDD3] bg-white p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-3 text-base font-bold text-[#1E2A5A]">Henüz Etkinlik Bulunmuyor</h3>
        <p className="mt-1 text-sm text-stone-500">
          İlk etkinliğinizi oluşturmak için &ldquo;Yeni Etkinlik&rdquo; butonunu kullanabilirsiniz.
        </p>
      </div>
    );
  }

  const handleStatus = async (id: string, status: PublicationStatus) => {
    setUpdatingId(id);
    try {
      await onStatusChange(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#DCDDD3] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#171916]">
          <thead className="border-b border-[#DCDDD3] bg-[#F5F3EC]/70 text-xs font-bold uppercase tracking-wider text-stone-600">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Etkinlik / Kategori
              </th>
              <th scope="col" className="px-6 py-3.5">
                Tarih ({TIMEZONE_LABEL})
              </th>
              <th scope="col" className="px-6 py-3.5">
                Konum / Kolaylaştırıcı
              </th>
              <th scope="col" className="px-6 py-3.5">
                Durum
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDDD3]">
            {events.map((event) => {
              const isUpdating = updatingId === event.id;
              return (
                <tr key={event.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {event.imagePath ? (
                        <Image
                          src={event.imagePath}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-md object-cover border border-[#DCDDD3]"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#F5F3EC] text-xs font-bold text-stone-400 border border-[#DCDDD3]">
                          Görsel Yok
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1E2A5A] line-clamp-1">
                            {event.title}
                          </span>
                          {event.isFeatured && (
                            <span
                              title="Öne Çıkarılmış Etkinlik"
                              className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800"
                            >
                              ★ Öne Çıkan
                            </span>
                          )}
                        </div>
                        <span className="inline-block mt-0.5 text-xs font-medium text-stone-500">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-700">
                    <div>
                      <span className="font-semibold">{formatIstanbulDateTime(event.startsAt)}</span>
                      {event.endsAt && (
                        <div className="text-stone-500">Bitiş: {formatIstanbulDateTime(event.endsAt)}</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs text-stone-700">
                    <div className="line-clamp-1">{event.location || "Mekan belirtilmedi"}</div>
                    <div className="text-stone-500 line-clamp-1">{event.lead || "Konuşmacı belirtilmedi"}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={event.publicationStatus} type="publication" />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        disabled={isUpdating}
                        className="rounded-md border border-[#DCDDD3] bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-[#F5F3EC] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
                      >
                        Düzenle
                      </button>

                      {event.publicationStatus === "draft" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(event.id, "published")}
                          disabled={isUpdating}
                          className="rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Yayınla"}
                        </button>
                      )}

                      {event.publicationStatus === "published" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(event.id, "draft")}
                          disabled={isUpdating}
                          className="rounded-md bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Taslağa Al"}
                        </button>
                      )}

                      {event.publicationStatus !== "archived" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(event.id, "archived")}
                          disabled={isUpdating}
                          className="rounded-md border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Arşivle"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
