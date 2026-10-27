import React from "react";

export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DCDDD3] border-t-[#1E2A5A]" />
      <span className="sr-only">Yükleniyor...</span>
      <p className="mt-4 text-sm font-medium text-stone-600">
        Yönetim paneli yükleniyor, lütfen bekleyin...
      </p>
    </div>
  );
}
