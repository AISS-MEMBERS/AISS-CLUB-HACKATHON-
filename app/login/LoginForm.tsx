"use client";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
        body: JSON.stringify({ email: fields.get("email"), password: fields.get("password") }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setError(result.error?.message || "Giriş yapılamadı."); return;
      }
      form.reset();
      window.location.replace("/admin");
    } catch { setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin."); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit} className="mt-6 space-y-4">
    <div><label className="block text-sm font-semibold" htmlFor="email">E-posta</label>
      <input id="email" name="email" type="email" autoComplete="username" required maxLength={254}
        className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></div>
    <div><label className="block text-sm font-semibold" htmlFor="password">Şifre</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024}
        className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></div>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button type="submit" disabled={pending} className="w-full rounded-md bg-[#1E2A5A] px-4 py-3 font-semibold text-white disabled:opacity-50">
      {pending ? "Giriş yapılıyor..." : "Giriş yap"}
    </button>
  </form>;
}
