"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { APPROVED_EVENT_IMAGES } from "./types";
import type { ApiResult } from "@/types/backend";
import { MAX_COVER_BYTES } from "@/lib/event-covers";

async function preparePhoto(file: File): Promise<Blob> {
  if (file.size > 20 * 1024 * 1024) throw new Error("Fotoğraf en fazla 20 MB olabilir.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    image.src = objectUrl;
    try { await image.decode(); }
    catch { throw new Error("Fotoğraf açılamadı. HEIC desteklenmiyorsa JPEG veya PNG olarak kaydedip tekrar seçin."); }
    const scale = Math.min(1, 1920 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      value => value ? resolve(value) : reject(new Error()), "image/jpeg", 0.82));
    if (blob.size > MAX_COVER_BYTES) throw new Error("Daha küçük bir fotoğraf seçin.");
    return blob;
  } finally { URL.revokeObjectURL(objectUrl); }
}

export default function EventCoverPicker({ value, onChange, onBusyChange }: {
  value: string; onChange: (value: string) => void; onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const active = useRef(false);
  const custom = value !== "" && !APPROVED_EVENT_IMAGES.some(image => image.value === value);
  async function upload(file: File) {
    if (active.current) return;
    active.current = true; setBusy(true); onBusyChange(true); setError("");
    try {
      const image = await preparePhoto(file);
      const response = await fetch("/api/admin/event-covers", {
        method: "POST", headers: { "Content-Type": "image/jpeg" }, body: image,
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json() as ApiResult<{ imagePath: string }>;
      if (!response.ok || !result.success) {
        throw new Error(!result.success ? result.error.message : "Fotoğraf yüklenemedi.");
      }
      onChange(result.data.imagePath);
    } catch (failure) {
      setError(failure instanceof Error && failure.message ? failure.message :
        "Fotoğraf açılamadı. HEIC desteklenmiyorsa JPEG veya PNG olarak kaydedip tekrar deneyin.");
    } finally { active.current = false; setBusy(false); onBusyChange(false); }
  }
  return <fieldset className="space-y-3 rounded-lg border border-[#DCDDD3] p-4" disabled={busy}>
    <legend className="px-1 text-xs font-bold uppercase text-stone-700">Etkinlik kapağı</legend>
    <label htmlFor="event-image" className="block text-sm font-semibold">Hazır görseller</label>
    <select id="event-image" value={value} onChange={event => { onChange(event.target.value); setError(""); }}
      className="min-h-11 w-full rounded-md border border-[#DCDDD3] bg-white px-3 py-2 text-sm">
      {APPROVED_EVENT_IMAGES.map(image => <option key={image.value} value={image.value}>{image.label}</option>)}
      {custom && <option value={value}>Yüklenen özel kapak</option>}
    </select>
    <label htmlFor="event-cover-upload" className="block text-sm font-semibold">Veya cihazından fotoğraf seç</label>
    <input id="event-cover-upload" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
      aria-describedby="event-cover-help event-cover-status" className="block min-h-11 w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#1E2A5A] file:px-4 file:py-3 file:text-white"
      onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void upload(file); }} />
    <p id="event-cover-help" className="text-xs leading-relaxed text-stone-500">
      Telefon galerisi veya bilgisayarından seç. Fotoğraf küçültülür; konum bilgileri kaldırılır. Kapaklar herkese açıktır.
    </p>
    <p id="event-cover-status" role="status" className={error ? "text-sm text-rose-700" : "text-sm text-stone-600"}>
      {busy ? "Fotoğraf hazırlanıyor ve yükleniyor..." : error || (custom ? "Özel kapak hazır." : "")}
    </p>
    {value && <Image src={value} alt="Seçilen etkinlik kapağı" width={640} height={360}
      unoptimized className="aspect-video w-full rounded-md object-cover" />}
  </fieldset>;
}
