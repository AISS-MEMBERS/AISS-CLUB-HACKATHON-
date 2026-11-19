"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SKS_URL = "https://sks.uskudar.edu.tr/ogrenci-kulupleri";

export default function JoinContent() {
  const { t } = useLanguage();

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="site-container py-12 sm:py-20" aria-labelledby="join-title">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
          {t.join.backToHome}
        </Link>
        <div className="mt-5 grid gap-8 border-b border-[#DCDDD3] pb-12 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">{t.join.universityTag}</p>
            <h1 id="join-title" className="mt-4 text-5xl font-extrabold tracking-tight sm:text-7xl">
              {t.join.title.replace(/\.$/, "")}<span className="text-[#F0784B]">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1E2A5A]/80">
              {t.join.description}
            </p>
          </div>
          <div className="rounded-2xl border border-[#DCDDD3] bg-white/60 p-6">
            <p className="text-sm font-bold">{t.join.readyCard.title}</p>
            <a
              href={SKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#1E2A5A] px-5 py-3 text-sm font-bold text-white hover:bg-[#2b3c7d] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {t.join.readyCard.sksButton}
            </a>
            <a
              href="#join-help"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
            >
              {t.join.readyCard.needHelp}
            </a>
          </div>
        </div>
      </section>

      <section id="join-help" className="site-container scroll-mt-24 pb-16" aria-labelledby="app-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1E2A5A]/60">
              {t.join.option1.badge}
            </p>
            <h2 id="app-title" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t.join.option1.title}
            </h2>
          </div>
          <span className="rounded-full border border-[#DCDDD3] px-4 py-2 text-xs font-semibold">
            {t.join.option1.platform}
          </span>
        </div>
        <ol className="grid gap-6 lg:grid-cols-3">
          {t.join.steps.map((step) => (
            <li key={step.number} className="flex flex-col rounded-2xl border border-[#DCDDD3] bg-white/60 p-6">
              <span className="text-sm font-bold tracking-widest text-[#F0784B]">{step.number}</span>
              <h3 className="mt-3 text-xl font-extrabold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#1E2A5A]/80">{step.body}</p>
              {step.image ? (
                <figure className="mt-6">
                  <a
                    href={step.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${step.title} - ${t.join.option1.tapToEnlarge}`}
                    className="mx-auto block max-w-[250px] rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <Image
                      src={step.image}
                      alt={step.alt}
                      width={828}
                      height={1792}
                      sizes="(max-width: 640px) 75vw, 250px"
                      className="h-auto w-full rounded-2xl border border-[#DCDDD3]"
                    />
                  </a>
                  <figcaption className="mt-3 text-center text-xs leading-5 text-[#1E2A5A]/65">
                    {step.caption} {t.join.option1.tapToEnlarge}
                  </figcaption>
                </figure>
              ) : (
                <div className="mt-8 rounded-xl border border-[#DCDDD3] bg-[#F5F3EC] p-6">
                  <p className="text-3xl font-extrabold">{t.join.option1.welcome.title}</p>
                  <p className="mt-4 text-sm leading-7">
                    {t.join.option1.welcome.prompt}
                    <Link href="/#contact" className="font-bold underline underline-offset-4">
                      {t.join.option1.welcome.contactLink}
                    </Link>
                    {t.join.option1.welcome.targetTopic}
                  </p>
                  <p className="mt-4 text-xs leading-5 text-[#1E2A5A]/65">{step.caption}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#DCDDD3] bg-[#e8e7df] py-12 sm:py-16" aria-labelledby="web-title">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1E2A5A]/60">
              {t.join.option2.badge}
            </p>
            <h2 id="web-title" className="mt-3 text-3xl font-extrabold tracking-tight">
              {t.join.option2.title}
            </h2>
            <ol className="mt-6 space-y-5 text-sm leading-7">
              {t.join.option2.steps.map((text, idx) => (
                <li key={idx}>
                  <strong>{idx + 1}.</strong> {text}
                </li>
              ))}
            </ol>
          </div>
          <figure className="rounded-2xl border border-[#DCDDD3] bg-white p-3 shadow-sm">
            <a
              href="/join-guide/web-registration.png"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
              aria-label={t.join.option2.imageAlt}
            >
              <Image
                src="/join-guide/web-registration.png"
                alt={t.join.option2.imageAlt}
                width={1527}
                height={727}
                sizes="(max-width: 1024px) 92vw, 60vw"
                className="h-auto w-full rounded-lg"
              />
            </a>
            <figcaption className="px-2 py-3 text-xs leading-5 text-[#1E2A5A]/65">
              {t.join.option2.imageCaption}
            </figcaption>
          </figure>
        </div>
      </section>

      <aside className="site-container py-10 text-sm leading-7" aria-label={t.join.disclaimer.ariaLabel}>
        <p className="font-bold">{t.join.disclaimer.title}</p>
        <p className="mt-1 text-[#1E2A5A]/75">{t.join.disclaimer.body}</p>
      </aside>
    </main>
  );
}
