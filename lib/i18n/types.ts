export type Locale = "en" | "tr";

export interface NavTranslations {
  home: string;
  about: string;
  events: string;
  team: string;
  contact: string;
  skipToContent: string;
  clubLogoAria: string;
  openMenu: string;
  closeMenu: string;
  mainNavigationAria: string;
  languageAriaLabel: string;
  switchToEn: string;
  switchToTr: string;
  joinClub: string;
}

export interface HeroTranslations {
  heading: string;
  description: string;
  exploreEvents: string;
  readAboutUs: string;
}

export interface FocusAreaTranslation {
  id: string;
  index: string;
  title: string;
  description: string;
  topics: readonly string[];
}

export interface StatTranslation {
  id: string;
  value: string;
  label: string;
  detail: string;
  isPlaceholder: boolean;
}

export interface AboutTranslations {
  ticker: string;
  focusAreasTitle: string;
  focusAreas: readonly FocusAreaTranslation[];
  showMoreMetrics: string;
  showLessMetrics: string;
  stats: readonly StatTranslation[];
}

export interface EventItemTranslation {
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

export interface EventsTranslations {
  ticker: string;
  featuredBadge: string;
  timelineBadge: string;
  sessionsListed: string;
  carouselLabel: string;
  categories: {
    workshop: string;
    talk: string;
    buildSession: string;
  };
  status: {
    upcoming: string;
    archived: string;
  };
  countdown: {
    completed: string;
    inProgress: string;
    daysUnit: string;
    hoursUnit: string;
    minutesUnit: string;
    left: string;
    ariaRemaining: string;
  };
  card: {
    locationLabel: string;
    leadLabel: string;
    freeEntry: string;
    showMore: string;
    showLess: string;
    transformerAlt: string;
  };
  timelineImages: Record<string, string>;
  states: {
    errorTitle: string;
    networkError: string;
    defaultError: (status: number) => string;
    retry: string;
    emptyTitle: string;
    emptyMessage: string;
  };
  featuredEvent: EventItemTranslation;
  timelineEvents: readonly EventItemTranslation[];
}

export interface TeamMemberRoleTranslation {
  id: string;
  role: string;
}

export interface FaqItemTranslation {
  id: string;
  question: string;
  answer: string;
}

export interface TeamTranslations {
  ticker: string;
  srOnlyTitle: string;
  showcaseLabel: string;
  showingMemberSr: (current: number, total: number, name: string, role?: string) => string;
  prevMember: string;
  nextMember: string;
  slidesTablistLabel: string;
  goToSlideAria: (index: number, name: string) => string;
  photoAlt: (name: string) => string;
  memberRoles: Record<string, string>;
  faqTitle: string;
  faqItems: readonly FaqItemTranslation[];
}

export interface ContactTranslations {
  badge: string;
  heading: string;
  directLineTitle: string;
  directLineDesc1: string;
  directLineDesc2: string;
  facultyLocation: string;
  stats: {
    members: string;
    projects: string;
    focusLabs: string;
  };
  responseTime: {
    title: string;
    desc: string;
  };
  form: {
    fullName: string;
    universityEmail: string;
    areaOfInterest: string;
    message: string;
    required: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    selectInterestPlaceholder: string;
    interests: {
      ml: string;
      robotics: string;
      joining: string;
      general: string;
    };
    messagePlaceholder: string;
    errors: {
      nameRequired: string;
      nameMin: string;
      nameMax: string;
      emailRequired: string;
      emailInvalid: string;
      emailMax: string;
      interestRequired: string;
      messageRequired: string;
      messageMin: string;
      messageMax: string;
      serverError: string;
      networkError: string;
    };
    submitting: string;
    submit: string;
    success: {
      title: string;
      desc: string;
      button: string;
    };
  };
}

export interface FooterTranslations {
  clubTitle: string;
  clubDesc: string;
  copyright: string;
  backToTop: string;
  logoAlt: string;
  footerAria: string;
  navAria: string;
}

export interface JoinStepTranslation {
  number: string;
  title: string;
  body: string;
  image: string | null;
  alt: string;
  caption: string;
}

export interface JoinTranslations {
  backToHome: string;
  universityTag: string;
  title: string;
  description: string;
  readyCard: {
    title: string;
    sksButton: string;
    needHelp: string;
  };
  option1: {
    badge: string;
    title: string;
    platform: string;
    tapToEnlarge: string;
    welcome: {
      title: string;
      prompt: string;
      contactLink: string;
      targetTopic: string;
    };
  };
  steps: readonly JoinStepTranslation[];
  option2: {
    badge: string;
    title: string;
    steps: readonly string[];
    imageAlt: string;
    imageCaption: string;
  };
  disclaimer: {
    title: string;
    body: string;
    ariaLabel: string;
  };
}

export interface NotFoundTranslations {
  errorCode: string;
  title: string;
  description: string;
  returnHome: string;
}

export interface Dictionary {
  nav: NavTranslations;
  hero: HeroTranslations;
  about: AboutTranslations;
  events: EventsTranslations;
  team: TeamTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
  join: JoinTranslations;
  notFound: NotFoundTranslations;
}
