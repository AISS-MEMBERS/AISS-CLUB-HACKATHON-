import React from "react";
import { MessageStatus, PublicationStatus } from "./types";

interface StatusBadgeProps {
  status: PublicationStatus | MessageStatus;
  type?: "publication" | "message";
}

export default function StatusBadge({ status, type = "publication" }: StatusBadgeProps) {
  if (type === "publication") {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            Yayında
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Taslak
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-700">
            Arşivlenmiş
          </span>
        );
      default:
        return null;
    }
  }

  // Message status
  switch (status) {
    case "new":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          Yeni
        </span>
      );
    case "read":
      return (
        <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
          Okundu
        </span>
      );
    case "archived":
      return (
        <span className="inline-flex items-center rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-700">
          Arşivde
        </span>
      );
    default:
      return null;
  }
}
