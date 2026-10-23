import { TEAM_MEMBERS, FAQ_ITEMS } from './team-data';
import { TeamShowcase } from './TeamShowcase';
import { FaqAccordion } from './FaqAccordion';
import { Archivo } from "next/font/google";

const headingFont = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export default function Team() {
  return (
    <section
      id="team"
      className="scroll-mt-24 rounded-2xl border border-[#DCDDD3] bg-[#F5F3EC] p-6 text-[#171916] md:p-10 shadow-sm"
      aria-labelledby="team-section-heading"
    >
      {/* 1. Section Header: "MEET OUR TEAM" Centered Above Showcase with Slide & Sweep Animations */}
      <style>{`
  @keyframes newsTickerScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .news-ticker-track {
    display: flex;
    width: max-content;
    animation: newsTickerScroll 25s linear infinite;
  }.news-ticker {
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
  .news-ticker:hover .news-ticker-track {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .news-ticker-track {
      animation: none;
    }
  }
`}</style>
      <header className="mb-6 translate-y-3 md:mb-8 md:translate-y-5">
        <h2
          id="team-section-heading"
          className={`${headingFont.className} mx-auto block max-w-5xl uppercase italic`}
        >
          <span className="sr-only">Meet Our Team</span>
          <span
            aria-hidden="true"
            className="news-ticker block overflow-hidden py-2 text-[#1E2A5A]"
          >
            <span className="news-ticker-track">
              {[0, 1].map((group) => (
                <span key={group} className="flex shrink-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="whitespace-nowrap pr-16 text-5xl font-semibold leading-none tracking-tight sm:text-6xl md:text-7xl"
                    >
                      Meet Our Team
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        </h2>
      </header>
      {/* 2. Circular Animated Team Showcase */}
      <div className="mb-5 md:mb-6">
        <TeamShowcase members={TEAM_MEMBERS} />
      </div>

      {/* 3. FAQ Subsection */}
      <div className="border-t border-[#DCDDD3] pt-5 md:pt-6">
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold tracking-tight text-[#1E2A5A] sm:text-3xl">
            FAQ
          </h3>
        </div>

        <FaqAccordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}