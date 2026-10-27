import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/nisa/SiteHeader";
import Footer from "@/components/selen/Footer";

export const metadata: Metadata = {
  title: "Join the Club | AISS Club",
  description: "Join AISS through Üsküdar University's app or official SKS website. A simple illustrated guide to club membership.",
};
const SKS_URL = "https://sks.uskudar.edu.tr/ogrenci-kulupleri";
const steps = [
  { number: "01", title: "Open Üsküdar Uni", body: "Sign in to the university app on iPhone or Android. Open Quick Menu and choose SKS.",
    image: "/join-guide/quick-menu.png", alt: "Üsküdar Uni Quick Menu with the SKS tile", caption: "Quick Menu → SKS" },
  { number: "02", title: "Find our club", body: "In Search in Clubs, try Yapay Zeka Kulübü or AISS. Look for Artificial Intelligence Club and our purple AI logo.",
    image: "/join-guide/club-list.png", alt: "Artificial Intelligence Club in the SKS club list, showing an example Registered badge", caption: "Our club appears under My Clubs after joining." },
  { number: "03", title: "Tap Join", body: "Open the club and tap Join. Follow any university prompts. Check for Registered or the club appearing in My Clubs to confirm.",
    image: null, alt: "", caption: "Official membership is completed in SKS." },
] as const;

export default function JoinPage() {
  return <div className="min-h-screen bg-[#F5F3EC] text-[#1E2A5A]">
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <section className="site-container py-12 sm:py-20" aria-labelledby="join-title">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">← Back to AISS</Link>
        <div className="mt-5 grid gap-8 border-b border-[#DCDDD3] pb-12 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">AISS · Üsküdar University</p>
            <h1 id="join-title" className="mt-4 text-5xl font-extrabold tracking-tight sm:text-7xl">Join the Club<span className="text-[#F0784B]">.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1E2A5A]/80">Your next project starts with a community. Complete your official club membership through the university&apos;s SKS system.</p>
          </div>
          <div className="rounded-2xl border border-[#DCDDD3] bg-white/60 p-6">
            <p className="text-sm font-bold">Ready to join?</p>
            <a href={SKS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#1E2A5A] px-5 py-3 text-sm font-bold text-white hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-4">Open official SKS website ↗</a>
            <a href="#join-help" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Need help joining? Follow the steps ↓</a>
          </div>
        </div>
      </section>

      <section id="join-help" className="site-container scroll-mt-24 pb-16" aria-labelledby="app-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#1E2A5A]/60">Option 1 · On your phone</p>
            <h2 id="app-title" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Use the Üsküdar Uni app</h2></div>
          <span className="rounded-full border border-[#DCDDD3] px-4 py-2 text-xs font-semibold">iPhone &amp; Android</span>
        </div>
        <ol className="grid gap-6 lg:grid-cols-3">
          {steps.map(step => <li key={step.number} className="flex flex-col rounded-2xl border border-[#DCDDD3] bg-white/60 p-6">
            <span className="text-sm font-bold tracking-widest text-[#F0784B]">{step.number}</span>
            <h3 className="mt-3 text-xl font-extrabold">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#1E2A5A]/80">{step.body}</p>
            {step.image ? <figure className="mt-6">
              <a href={step.image} target="_blank" rel="noopener noreferrer" aria-label={`View full-size reference: ${step.title}`} className="mx-auto block max-w-[250px] rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4">
                <Image src={step.image} alt={step.alt} width={828} height={1792} sizes="(max-width: 640px) 75vw, 250px" className="h-auto w-full rounded-2xl border border-[#DCDDD3]" />
              </a>
              <figcaption className="mt-3 text-center text-xs leading-5 text-[#1E2A5A]/65">{step.caption} Tap the image to enlarge.</figcaption>
            </figure> : <div className="mt-8 rounded-xl border border-[#DCDDD3] bg-[#F5F3EC] p-6">
              <p className="text-3xl font-extrabold">Welcome to AISS.</p>
              <p className="mt-4 text-sm leading-7">Want to build with us? After joining, <Link href="/#contact" className="font-bold underline underline-offset-4">introduce yourself to the team</Link> and tell us what you&apos;d like to work on.</p>
              <p className="mt-4 text-xs leading-5 text-[#1E2A5A]/65">{step.caption}</p>
            </div>}
          </li>)}
        </ol>
      </section>

      <section className="border-y border-[#DCDDD3] bg-[#e8e7df] py-12 sm:py-16" aria-labelledby="web-title">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#1E2A5A]/60">Option 2 · In your browser</p>
            <h2 id="web-title" className="mt-3 text-3xl font-extrabold tracking-tight">Join on the SKS website</h2>
            <ol className="mt-6 space-y-5 text-sm leading-7">
              <li><strong>1.</strong> Open <a href={SKS_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">Öğrenci Kulüpleri ↗</a>.</li>
              <li><strong>2.</strong> Search for <strong>Yapay Zeka Kulübü</strong>. If browsing the numbered pages, check page <strong>5</strong>; the list order may change.</li>
              <li><strong>3.</strong> Open our club and complete the official member form. The university may request your student number, university email and university password.</li>
              <li><strong>4.</strong> Read the university&apos;s information notice, tick the required consent and press <strong>Sign Up / Katıl</strong>.</li>
            </ol>
          </div>
          <figure className="rounded-2xl border border-[#DCDDD3] bg-white p-3 shadow-sm">
            <a href="/join-guide/web-registration.png" target="_blank" rel="noopener noreferrer" className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4" aria-label="View the full-size official SKS registration form">
              <Image src="/join-guide/web-registration.png" alt="Official SKS Artificial Intelligence Club registration dialog with empty student number, email and password fields" width={1527} height={727} sizes="(max-width: 1024px) 92vw, 60vw" className="h-auto w-full rounded-lg" />
            </a>
            <figcaption className="px-2 py-3 text-xs leading-5 text-[#1E2A5A]/65">Reference from the university website. Labels can differ by language. Tap to enlarge.</figcaption>
          </figure>
        </div>
      </section>
      <aside className="site-container py-10 text-sm leading-7" aria-label="Membership information">
        <p className="font-bold">Membership happens on official university channels.</p>
        <p className="mt-1 text-[#1E2A5A]/75">Enter university credentials only in the official Üsküdar Uni app or on the official university website. AISS never asks for your university password. Sending our contact form does not register you as a club member.</p>
      </aside>
    </main>
    <Footer />
  </div>;
}
