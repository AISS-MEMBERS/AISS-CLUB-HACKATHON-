import EventsData from "./EventsData";

export default function Events() {
  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="site-section text-[#1E2A5A]"
    >
      <div className="site-container">
        {/* 1. SECTION HEADER (frontend-design.md Section 11.1) */}
        <header className="mb-8 border-b border-[#DCDDD3] pb-6 md:mb-10">
          <h2
            id="events-heading"
            className="overflow-hidden text-2xl font-bold tracking-tight text-[#1E2A5A] sm:text-3xl md:text-4xl"
          >
            <div className="animate-marquee flex w-max whitespace-nowrap">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="flex items-center"
                  aria-hidden={i > 0 ? "true" : undefined}
                >
                  Academic Calendar &amp; Working Sessions
                  <span
                    className="mx-8 inline-block h-2.5 w-2.5 rounded-full bg-[#1E2A5A] md:h-3 md:w-3"
                    aria-hidden="true"
                  />
                </span>
              ))}
            </div>
          </h2>
        </header>

        {/* 2. DYNAMIC CLIENT EVENTS LOADER */}
        <EventsData />
      </div>
    </section>
  );
}
