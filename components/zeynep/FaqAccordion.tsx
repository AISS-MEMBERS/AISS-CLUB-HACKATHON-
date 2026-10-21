import { FaqItem } from './types';

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="rounded-xl border border-[#DCDDD3] bg-[#FFFFFF] divide-y divide-[#DCDDD3] shadow-xs">
      {items.map((item) => (
        <details
          key={item.id}
          className="group px-4 sm:px-6 transition-colors duration-150 open:bg-[#F5F3EC]/30 first:rounded-t-xl last:rounded-b-xl"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 sm:py-5 text-left font-semibold text-base sm:text-lg text-[#1E2A5A] transition-colors group-open:text-[#1E2A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2 rounded-md [&::-webkit-details-marker]:hidden">
            <span className="pr-4 leading-snug">{item.question}</span>

            {/* Custom rotating chevron indicator */}
            <span
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[#DCDDD3] bg-[#F5F3EC] text-[#77796F] transition-all duration-200 group-hover:border-[#1E2A5A]/40 group-open:rotate-180 group-open:bg-[#1E2A5A] group-open:text-white"
              aria-hidden="true"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </summary>

          <div className="pb-5 pt-1 text-sm sm:text-base leading-relaxed text-[#77796F] max-w-[70ch] w-full [&_strong]:font-bold [&_strong]:text-[#1E2A5A] [&_b]:font-bold [&_b]:text-[#1E2A5A]">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
