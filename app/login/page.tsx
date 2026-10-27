import LoginForm from "./LoginForm";

export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#F5F3EC] px-4 py-12 text-[#1E2A5A]">
    <section className="w-full max-w-md rounded-xl border border-[#DCDDD3] bg-white p-7 shadow-sm">
      <h1 className="text-2xl font-bold">AISS Club Yönetici Girişi</h1>
      <p className="mt-2 text-sm text-stone-600">Yalnızca yetkilendirilmiş kulüp yöneticileri giriş yapabilir.</p>
      <LoginForm />
    </section>
  </main>;
}
