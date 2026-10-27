import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/backend/auth/require-admin";
import { ApiError } from "@/lib/backend/shared/api";

async function Authorized({ children }: { children: ReactNode }) {
  await cookies(); // Never evaluate authorization during prerender.
  let failure: ApiError | undefined;
  try { await requireAdmin(); }
  catch (error) {
    failure = error instanceof ApiError ? error :
      new ApiError(503, "SERVICE_UNAVAILABLE", "Yönetim hizmeti şu an kullanılamıyor.");
  }
  if (failure?.status === 401) redirect("/login");
  if (failure) {
    return <main className="mx-auto max-w-xl p-8" role="alert">
      <h1 className="text-xl font-bold">Yönetim erişimi kullanılamıyor</h1>
      <p className="mt-4">{failure.status === 403 ? "Bu hesabın yönetici yetkisi bulunmuyor." :
        "Bağlantı veya yapılandırma hatası. Lütfen daha sonra tekrar deneyin."}</p>
      <a className="mt-4 inline-block underline" href="/login">Giriş sayfası</a>
    </main>;
  }
  return children;
}
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p className="p-8">Oturum kontrol ediliyor...</p>}>
    <Authorized>{children}</Authorized>
  </Suspense>;
}
