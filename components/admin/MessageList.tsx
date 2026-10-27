"use client";

import React, { useState } from "react";
import { ContactMessage, MessageStatus } from "./types";
import StatusBadge from "./StatusBadge";
import { formatIstanbulDateTime, TIMEZONE_LABEL } from "./timezone";

interface MessageListProps {
  messages: ContactMessage[];
  onViewDetail: (message: ContactMessage) => void;
  onStatusChange: (id: string, status: MessageStatus) => Promise<void>;
}

export default function MessageList({
  messages,
  onViewDetail,
  onStatusChange,
}: MessageListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (messages.length === 0) {
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-3 text-base font-bold text-[#1E2A5A]">Henüz Gelen Mesaj Yok</h3>
        <p className="mt-1 text-sm text-stone-500">
          Web sitesi iletişim formundan gönderilen mesajlar burada listelenecektir.
        </p>
      </div>
    );
  }

  const handleStatus = async (id: string, status: MessageStatus) => {
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
                Gönderen / E-posta
              </th>
              <th scope="col" className="px-6 py-3.5">
                İlgi Alanı / Mesaj Özeti
              </th>
              <th scope="col" className="px-6 py-3.5">
                Tarih ({TIMEZONE_LABEL})
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
            {messages.map((msg) => {
              const isUpdating = updatingId === msg.id;
              return (
                <tr key={msg.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1E2A5A]">{msg.fullName}</div>
                    <div className="text-xs font-mono text-stone-600">{msg.universityEmail}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-block rounded-md bg-[#F5F3EC] px-2 py-0.5 text-xs font-semibold text-[#1E2A5A] border border-[#DCDDD3]">
                      {msg.areaOfInterest}
                    </span>
                    <p className="mt-1 line-clamp-1 text-xs text-stone-600">{msg.message}</p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-700">
                    {formatIstanbulDateTime(msg.createdAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={msg.status} type="message" />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetail(msg)}
                        className="rounded-md border border-[#DCDDD3] bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-[#F5F3EC] focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
                      >
                        İncele
                      </button>

                      {msg.status === "new" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(msg.id, "read")}
                          disabled={isUpdating}
                          className="rounded-md bg-teal-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Okundu"}
                        </button>
                      )}

                      {msg.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(msg.id, "archived")}
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
