export type SocialPlatform = 'github' | 'linkedin';

export interface SocialLink {
  platform: SocialPlatform;
  url?: string;
  ariaLabel: string;
}

export interface TeamMember {
  id: string;
  name: string;
  monogram: string;
  role?: string;
  branch?: string;
  department?: string;
  bio?: string;
  imageSrc?: string;
  imagePosition?: string;
  socials: SocialLink[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
