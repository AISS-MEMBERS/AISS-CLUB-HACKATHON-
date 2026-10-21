'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TeamMember, SocialPlatform } from './types';

interface MemberCardProps {
  member: TeamMember;
  isFeatured?: boolean;
  isDistant?: boolean;
  onClick?: () => void;
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'github') {
    return (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export function MemberCard({
  member,
  isFeatured = true,
  isDistant = false,
  onClick,
}: MemberCardProps) {
  const [imageError, setImageError] = useState(false);
  const availableSocials = member.socials.filter((s) => Boolean(s.url));

  const hasPhoto = Boolean(member.imageSrc) && !imageError;

  return (
    <article
      onClick={!isFeatured ? onClick : undefined}
      className={`group flex w-full flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-300 ${isFeatured
        ? 'border-[#1E2A5A]/30 shadow-lg ring-1 ring-[#1E2A5A]/10'
        : 'border-[#DCDDD3] shadow-xs hover:border-[#1E2A5A]/40 hover:shadow-md cursor-pointer'
        }`}
      aria-labelledby={`member-name-${member.id}`}
      aria-current={isFeatured ? 'true' : undefined}
    >
      <div>
        {/* 1. Member Photo with Graceful Fallback and Custom Focal Position */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#DCDDD3] bg-[#F5F3EC]">
          {hasPhoto && member.imageSrc ? (
            <Image
              src={member.imageSrc}
              alt={`Photo of ${member.name}`}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 340px"
              className={`object-cover transition-transform duration-500 group-hover:scale-102 ${member.imagePosition || 'object-center'}`}
              priority={isFeatured}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#F5F3EC]">
              <div
                className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-[#DCDDD3] bg-white shadow-xs"
                aria-hidden="true"
              >
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-[#1E2A5A]">
                  {member.monogram}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2 & 3. Full Name and Role (Intentionally hidden on distant cards to prevent clipped illegible text) */}
        {!isDistant ? (
          <div className="mt-4 text-center">
            <h3
              id={`member-name-${member.id}`}
              className="text-lg sm:text-xl font-bold tracking-tight text-[#1E2A5A] break-words text-center leading-tight"
            >
              {member.name}
            </h3>

            {member.role && (
              <p className="mt-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#77796F] max-w-[220px] sm:max-w-[250px] mx-auto text-center leading-snug break-words">
                {member.role}
              </p>
            )}
          </div>
        ) : (
          <div className="sr-only">
            <h3>{member.name}</h3>
            {member.role && <p>{member.role}</p>}
          </div>
        )}
      </div>

      {/* 4 & 5. Available Social Links (Centered single icon support, hidden on distant cards) */}
      {!isDistant && availableSocials.length > 0 && (
        <div className="mt-5 flex w-full items-center justify-center gap-2.5 border-t border-[#DCDDD3] pt-4">
          {availableSocials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              tabIndex={isFeatured ? 0 : -1}
              onClick={(e) => {
                // Prevent card click when clicking social link
                e.stopPropagation();
              }}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#DCDDD3] bg-[#F5F3EC] text-[#171916] transition-all duration-150 hover:border-[#1E2A5A] hover:bg-[#1E2A5A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A] focus-visible:ring-offset-2"
            >
              <SocialIcon platform={social.platform} />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
