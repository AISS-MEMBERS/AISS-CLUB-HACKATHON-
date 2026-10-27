import React from "react";

interface DemoBannerProps {
  message?: string;
}

export default function DemoBanner({
  message = "DEMO - not connected (API'ler henüz hazır değil veya arka uç bağlantısı yok)",
}: DemoBannerProps) {
  return (
    <aside
      aria-label="Demo durumu uyarısı"
      className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none" aria-hidden="true">
          ⚠️
        </span>
        <div className="text-sm">
          <p className="font-bold tracking-tight">DEMO MODU AKTİF</p>
          <p className="mt-0.5 text-amber-800">
            {message}. Görüntülenen veriler test amaçlı sentetik fixtures verileridir. Arka uç API entegrasyonu tamamlandığında gerçek veritabanı kayıtları gösterilecektir.
          </p>
        </div>
      </div>
    </aside>
  );
}
