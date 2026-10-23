import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate w-full overflow-hidden bg-[#F5F3EC] text-[#1E2A5A]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/students/nisa/campus-bg.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3EC]/25 via-[#F5F3EC]/60 to-[#F5F3EC]" />
      </div>
      <div className="site-container flex min-h-[480px] items-center py-16 sm:min-h-[560px] md:py-24">
        <div className="max-w-4xl space-y-8">
          <h1
            id="hero-heading"
            className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Bridging academic curiosity with real-world AI impact.
          </h1>
          <p className="max-w-2xl text-base font-medium leading-relaxed sm:text-lg">
            A community of undergraduate engineers and researchers collaborating to push
            the boundaries of AI through hands-on development.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#events"
              className="inline-flex min-h-11 items-center rounded-md border border-[#171916] bg-[#1E2A5A] px-6 py-3 text-sm font-semibold text-white shadow-[3px_3px_0px_0px_#171916] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916] motion-reduce:transform-none"
            >
              Explore Events
            </a>
            <a
              href="#about"
              className="inline-flex min-h-11 items-center rounded-md border border-[#DCDDD3] bg-white px-6 py-3 text-sm font-semibold text-[#171916] transition-colors hover:bg-[#DCDDD3]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
            >
              Read About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
