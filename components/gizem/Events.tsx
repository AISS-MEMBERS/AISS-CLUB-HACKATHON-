import FeaturedSessionCard from "./FeaturedSessionCard";
import TimelineEventCard from "./TimelineEventCard";

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  lead?: string;
  category: "WORKSHOP" | "TALK" | "BUILD SESSION";
  description: string;
  status: "upcoming" | "past";
}

// Editorial sample events — replace placeholders with real club data when available
const FEATURED_EVENT: ClubEvent = {
  id: "featured-1",
  title: "Upcoming Workshop: Introduction to Transformer Architectures",
  date: "OCT 28",
  time: "18:00 – 20:00",
  location: "Room 402 // Campus Lab",
  lead: "Lead: Student Research Group",
  category: "WORKSHOP",
  description:
    "A hands-on dissection of self-attention mechanisms and practical PyTorch tensor operations. Open to all students with basic Python knowledge.",
  status: "upcoming",
};

const TIMELINE_EVENTS: ClubEvent[] = [
  FEATURED_EVENT,
  {
    id: "evt-1",
    title: "Upcoming Build: Open-Source LLM Fine-Tuning Sprint",
    date: "NOV 12",
    time: "14:00 – 17:30",
    location: "Room 204 // Engineering Building",
    lead: "Lead: Machine Learning Track",
    category: "BUILD SESSION",
    description:
      "Collaborative sprint setting up parameter-efficient fine-tuning (LoRA) pipelines on local hardware and university compute clusters.",
    status: "upcoming",
  },
  {
    id: "evt-2",
    title: "Past Workshop: Foundations of Computer Vision with OpenCV",
    date: "OCT 08",
    time: "17:00 – 19:00",
    location: "Room 402 // Campus Lab",
    lead: "Lead: Robotics Working Group",
    category: "WORKSHOP",
    description:
      "Covered image transformations, edge detection, and real-time webcam tracking algorithms with complete Python code examples.",
    status: "past",
  },
  {
    id: "evt-3",
    title: "Past Seminar: Ethics and Data Governance in Modern AI",
    date: "SEP 24",
    time: "18:00 – 19:30",
    location: "Auditorium B // Main Campus",
    lead: "Lead: Tech & Policy Seminar",
    category: "TALK",
    description:
      "Panel discussion on algorithmic bias, data lineage, and safety considerations in student-led machine learning projects.",
    status: "past",
  },
];

export default function Events() {
  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="scroll-mt-24 rounded-2xl border border-[#DCDDD3] bg-[#F5F3EC] p-6 text-[#1E2A5A] md:p-10 shadow-sm"
    >
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

      {/* 2. FEATURED UPCOMING EVENT CARD */}
      <div className="mb-10">
        <div className="-mt-4 mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E2A5A]">
            Featured Session // Next Up
          </span>
        </div>

        <div className="w-full px-4 sm:px-6">
          <FeaturedSessionCard event={FEATURED_EVENT} />
        </div>
      </div>

      {/* 3. CHRONOLOGICAL TIMELINE */}
      <div>
        <div className="mb-0 mt-10 flex items-center justify-between pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E2A5A]">
            Semester Timeline // All Sessions
          </h3>
          <span className="text-xs text-[#1E2A5A]">
            {TIMELINE_EVENTS.length} SESSIONS LISTED
          </span>
        </div>

        <ol
          tabIndex={0}
          aria-label="Semester timeline events"
          className="relative flex items-stretch gap-6 overflow-x-auto pb-6 pt-4 px-4 sm:px-6 scroll-smooth snap-x snap-mandatory focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
        >
          {TIMELINE_EVENTS.map((event, index) => {
            const isUpcoming = event.status === "upcoming";

            return (
              <li
                key={event.id}
                className="relative flex flex-col flex-shrink-0 snap-start w-[300px] sm:w-[340px] lg:w-[350px] [@media(hover:hover)]:hover:z-20"
              >
                {/* Timeline horizontal connector track & indicator dot */}
                <div className="relative mb-3 flex items-center">
                  <div
                    className={`absolute top-1/2 h-0.5 -translate-y-1/2 bg-[#DCDDD3] ${index === 0
                      ? "left-0 -right-6"
                      : index === TIMELINE_EVENTS.length - 1
                        ? "-left-6 right-0"
                        : "-left-6 -right-6"
                      }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`relative z-10 ml-6 h-3.5 w-3.5 rounded-full border-2 border-[#F5F3EC] ${isUpcoming
                      ? "bg-[#1E2A5A] ring-2 ring-[#1E2A5A] shadow-[0_0_8px_rgba(30,42,90,0.5)]"
                      : "bg-[#1E2A5A]"
                      }`}
                    aria-hidden="true"
                  />
                </div>

                <TimelineEventCard event={event} isFirst={index === 0} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

