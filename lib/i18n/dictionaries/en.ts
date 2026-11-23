import type { Dictionary } from "../types";

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    events: "Events",
    team: "Team",
    contact: "Contact",
    skipToContent: "Skip to content",
    clubLogoAria: "AISS Club home",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    mainNavigationAria: "Main navigation",
    languageAriaLabel: "Select language",
    switchToEn: "Switch to English",
    switchToTr: "Switch to Turkish",
    joinClub: "Join the Club",
  },
  hero: {
    heading: "Bridging academic curiosity with real-world AI impact.",
    description:
      "A community of undergraduate engineers and researchers collaborating to push the boundaries of AI through hands-on development.",
    exploreEvents: "Explore Events",
    readAboutUs: "Read About Us",
  },
  about: {
    ticker: "Intelligence Built Through Curiosity and Collaboration",
    focusAreasTitle: "Core Focus Areas",
    focusAreas: [
      {
        id: "ml-fundamentals",
        index: "01",
        title: "Machine Learning",
        description:
          "Investigating core learning algorithms, gradient optimization, loss landscape geometry, and model evaluation metrics through clean PyTorch implementations.",
        topics: ["Statistical Learning", "Gradient Methods", "PyTorch"],
      },
      {
        id: "vision-robotics",
        index: "02",
        title: "Computer Vision",
        description:
          "Connecting perceptual representations with real-time physical systems, covering spatial intelligence, visual SLAM, and embedded neural inference.",
        topics: ["Spatial Intelligence", "Edge Inference", "ROS 2"],
      },
      {
        id: "responsible-ai",
        index: "03",
        title: "Responsible AI",
        description:
          "Approaching algorithmic fairness, safety auditing, and dataset provenance as foundational engineering specifications for autonomous systems.",
        topics: ["Algorithmic Fairness", "Safety Auditing", "Governance"],
      },
    ],
    showMoreMetrics: "Show more club metrics ↓",
    showLessMetrics: "Show less metrics ↑",
    stats: [
      {
        id: "workshops",
        value: "[Verified workshop count]",
        label: "Hands-on Workshops",
        detail: "PyTorch labs, model architecture deep-dives, and systems code sprints.",
        isPlaceholder: true,
      },
      {
        id: "members",
        value: "[Verified member count]",
        label: "Active Contributors",
        detail: "Undergraduate and graduate students across CS, data, and engineering.",
        isPlaceholder: true,
      },
      {
        id: "working-groups",
        value: "[Verified working group count]",
        label: "Specialized Working Groups",
        detail: "Autonomous tracks in ML foundations, vision systems, and AI policy.",
        isPlaceholder: true,
      },
      {
        id: "events",
        value: "[Verified annual event count]",
        label: "Annual Hackathons",
        detail: "Open university-wide build competitions and research symposiums.",
        isPlaceholder: true,
      },
    ],
  },
  events: {
    ticker: "Academic Calendar & Working Sessions",
    featuredBadge: "Featured Session // Next Up",
    timelineBadge: "Semester Timeline // All Sessions",
    sessionsListed: "SESSIONS LISTED",
    carouselLabel: "Semester timeline events",
    categories: {
      workshop: "WORKSHOP",
      talk: "TALK",
      buildSession: "BUILD SESSION",
    },
    status: {
      upcoming: "UPCOMING",
      archived: "ARCHIVED",
    },
    countdown: {
      completed: "COMPLETED",
      inProgress: "IN PROGRESS",
      daysUnit: "D",
      hoursUnit: "H",
      minutesUnit: "M",
      left: "LEFT",
      ariaRemaining: "Time remaining",
    },
    card: {
      locationLabel: "Location:",
      leadLabel: "Lead:",
      freeEntry: "Free entry for students →",
      showMore: "Show more",
      showLess: "Show less",
      transformerAlt: "Transformer neural network architecture schematic diagram",
    },
    timelineImages: {
      "featured-1": "Transformer neural network architecture schematic diagram",
      "evt-1": "Large language model fine-tuning data pipeline schematic diagram",
      "evt-2": "Computer vision and OpenCV image processing pipeline schematic diagram",
      "evt-3": "AI ethics and data governance framework schematic diagram",
      default: "AI technical session schematic diagram",
    },
    states: {
      errorTitle: "Academic sessions currently unavailable",
      networkError: "Network error occurred while fetching club events.",
      defaultError: (status: number) => `Failed to load events (HTTP ${status}).`,
      retry: "Retry",
      emptyTitle: "No published sessions at this time",
      emptyMessage: "Check back soon for upcoming workshops, talks, and build sessions.",
    },
    featuredEvent: {
      id: "featured-1",
      title: "Upcoming Workshop: Introduction to Transformer Architectures",
      date: "OCT 28",
      time: "18:00 – 20:00",
      location: "Room 402 // Campus Lab",
      lead: "Student Research Group",
      category: "WORKSHOP",
      description:
        "A hands-on dissection of self-attention mechanisms and practical PyTorch tensor operations. Open to all students with basic Python knowledge.",
      status: "upcoming",
    },
    timelineEvents: [
      {
        id: "featured-1",
        title: "Upcoming Workshop: Introduction to Transformer Architectures",
        date: "OCT 28",
        time: "18:00 – 20:00",
        location: "Room 402 // Campus Lab",
        lead: "Student Research Group",
        category: "WORKSHOP",
        description:
          "A hands-on dissection of self-attention mechanisms and practical PyTorch tensor operations. Open to all students with basic Python knowledge.",
        status: "upcoming",
      },
      {
        id: "evt-1",
        title: "Upcoming Build: Open-Source LLM Fine-Tuning Sprint",
        date: "NOV 12",
        time: "14:00 – 17:30",
        location: "Room 204 // Engineering Building",
        lead: "Machine Learning Track",
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
        lead: "Robotics Working Group",
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
        lead: "Tech & Policy Seminar",
        category: "TALK",
        description:
          "Panel discussion on algorithmic bias, data lineage, and safety considerations in student-led machine learning projects.",
        status: "past",
      },
    ],
  },
  team: {
    ticker: "Meet Our Team",
    srOnlyTitle: "Meet Our Team",
    showcaseLabel: "AISS Club team members showcase",
    showingMemberSr: (current, total, name, role) =>
      `Showing team member ${current} of ${total}: ${name}${role ? `, ${role}` : ""}`,
    prevMember: "Previous team member",
    nextMember: "Next team member",
    slidesTablistLabel: "Team member slides",
    goToSlideAria: (index, name) => `Go to slide ${index}: ${name}`,
    photoAlt: (name) => `Photo of ${name}`,
    memberRoles: {
      "selen-y": "Co-Lead & Frontend Developer",
      "mohamad-barakat": "Club Lead & Systems Architect",
      "zeynep-a": "Core Team & Frontend Developer",
      "gizem-a": "Core Team & Frontend Developer",
      "nisa-c": "Core Team & Frontend Developer",
      "meryem-b": "Core Team & Frontend Developer",
      "yagmur-d": "Core Team & Frontend Developer",
    },
    faqTitle: "FAQ",
    faqItems: [
      {
        id: "faq-1",
        question: "What is AISS Club and who can participate?",
        answer:
          "AISS Club (Artificial Intelligence & Intelligent Systems Club) is an open university laboratory and collaborative study group. Any student interested in machine learning, intelligent systems, software development, or engineering research—regardless of major or year—is welcome to attend our meetings and open build sessions.",
      },
      {
        id: "faq-2",
        question: "How do student teams collaborate on this codebase?",
        answer:
          "We follow structured Git workflows: each student engineer owns an assigned training branch (student/<name>) and a dedicated component module. We use local Docker containers for consistent development environments, review git diffs carefully, and submit pull requests targeting main with lead reviews.",
      },
      {
        id: "faq-3",
        question: "Does the contact form or website collect any personal data?",
        answer:
          "No. In strict accordance with our team charter (AGENTS.md), the contact form is a front-end educational simulation. Submissions are never transmitted over the network, saved in databases, or logged to browser storage or server files.",
      },
      {
        id: "faq-4",
        question: "How can I attend upcoming workshops and hackathons?",
        answer:
          "All upcoming sessions are published in the Events timeline above. You can join our scheduled campus lab sessions directly or connect through our university student channels. No prior registration or fee is required for open study groups.",
      },
      {
        id: "faq-5",
        question: "What tools and technologies are we currently exploring?",
        answer:
          "Our web platform is built with Next.js (App Router), TypeScript, Tailwind CSS, and Docker. For intelligence and machine learning projects, our members work with Python, PyTorch, Hugging Face transformers, and local open-weight model architectures.",
      },
    ],
  },
  contact: {
    badge: "AISS ENGINEERING CLUB 2026",
    heading: "Let's build something intelligent together.",
    directLineTitle: "Direct Technical Line",
    directLineDesc1:
      "Our engineering society is open to all students passionate about building real-world AI systems, firmware, and collaborative open-source tools.",
    directLineDesc2:
      "Drop your proposal, workshop question, or membership interest using the form. Our core team reviews incoming messages daily.",
    facultyLocation: "Faculty of Engineering & Natural Sciences – Lab 3",
    stats: {
      members: "Members",
      projects: "Projects",
      focusLabs: "Focus Labs",
    },
    responseTime: {
      title: "Typical Response Time",
      desc: "We review incoming messages during weekdays. You can typically expect a response within 24 to 48 hours.",
    },
    form: {
      fullName: "Full Name",
      universityEmail: "University Email",
      areaOfInterest: "Area of Interest",
      message: "Message",
      required: "REQUIRED",
      namePlaceholder: "e.g. Ada Lovelace",
      emailPlaceholder: "student@university.edu",
      selectInterestPlaceholder: "Select an area of interest",
      interests: {
        ml: "Machine Learning",
        robotics: "Robotics",
        joining: "Joining the Team",
        general: "General Inquiry",
      },
      messagePlaceholder:
        "Share your questions, research ideas, or why you'd like to collaborate with AISS Club...",
      errors: {
        nameRequired: "Please enter your full name.",
        nameMin: "Full name must be at least 2 characters.",
        nameMax: "Full name cannot exceed 100 characters.",
        emailRequired: "Please enter your university email.",
        emailInvalid:
          "Please enter a valid university email address (e.g. name@university.edu).",
        emailMax: "Email address cannot exceed 254 characters.",
        interestRequired: "Please select an area of interest.",
        messageRequired: "Please enter your message.",
        messageMin: "Message must be at least 10 characters.",
        messageMax: "Message cannot exceed 3000 characters.",
        serverError: "Failed to submit message. Please try again.",
        networkError: "Network error: Could not connect to the server. Please check your connection and try again.",
      },
      submitting: "Sending...",
      submit: "Send Message",
      success: {
        title: "Message Received",
        desc: "Thank you for contacting the AISS Club! Your message has been saved for our core team. We review incoming messages daily.",
        button: "Send Another Message",
      },
    },
  },
  footer: {
    clubTitle: "AISS — Artificial Intelligence & Intelligent Systems",
    clubDesc:
      "A student-led community exploring artificial intelligence, intelligent systems, and practical engineering.",
    copyright: "© 2026 AISS Club. All rights reserved.",
    backToTop: "Back to top",
    logoAlt: "AISS Club Logo",
    footerAria: "Site Footer",
    navAria: "Footer Navigation",
  },
  join: {
    backToHome: "← Back to AISS",
    universityTag: "AISS · Üsküdar University",
    title: "Join the Club.",
    description:
      "Your next project starts with a community. Complete your official club membership through the university's SKS system.",
    readyCard: {
      title: "Ready to join?",
      sksButton: "Open official SKS website ↗",
      needHelp: "Need help joining? Follow the steps ↓",
    },
    option1: {
      badge: "Option 1 · On your phone",
      title: "Use the Üsküdar Uni app",
      platform: "iPhone & Android",
      tapToEnlarge: "Tap the image to enlarge.",
      welcome: {
        title: "Welcome to AISS.",
        prompt: "Want to build with us? After joining, ",
        contactLink: "introduce yourself to the team",
        targetTopic: " and tell us what you'd like to work on.",
      },
    },
    steps: [
      {
        number: "01",
        title: "Open Üsküdar Uni",
        body: "Sign in to the university app on iPhone or Android. Open Quick Menu and choose SKS.",
        image: "/join-guide/quick-menu.png",
        alt: "Üsküdar Uni Quick Menu with the SKS tile",
        caption: "Quick Menu → SKS",
      },
      {
        number: "02",
        title: "Find our club",
        body: "In Search in Clubs, try Yapay Zeka Kulübü or AISS. Look for Artificial Intelligence Club and our purple AI logo.",
        image: "/join-guide/club-list.png",
        alt: "Artificial Intelligence Club in the SKS club list, showing an example Registered badge",
        caption: "Our club appears under My Clubs after joining.",
      },
      {
        number: "03",
        title: "Tap Join",
        body: "Open the club and tap Join. Follow any university prompts. Check for Registered or the club appearing in My Clubs to confirm.",
        image: null,
        alt: "",
        caption: "Official membership is completed in SKS.",
      },
    ],
    option2: {
      badge: "Option 2 · In your browser",
      title: "Join on the SKS website",
      steps: [
        "Open Öğrenci Kulüpleri ↗.",
        "Search for Yapay Zeka Kulübü. If browsing the numbered pages, check page 5; the list order may change.",
        "Open our club and complete the official member form. The university may request your student number, university email and university password.",
        "Read the university's information notice, tick the required consent and press Sign Up / Katıl.",
      ],
      imageAlt:
        "Official SKS Artificial Intelligence Club registration dialog with empty student number, email and password fields",
      imageCaption:
        "Reference from the university website. Labels can differ by language. Tap to enlarge.",
    },
    disclaimer: {
      title: "Membership happens on official university channels.",
      body: "Enter university credentials only in the official Üsküdar Uni app or on the official university website. AISS never asks for your university password. Sending our contact form does not register you as a club member.",
      ariaLabel: "Membership information",
    },
  },
  notFound: {
    errorCode: "Error 404",
    title: "Page Not Found",
    description: "The page you are looking for does not exist or has been moved.",
    returnHome: "Return to Main Page",
  },
};
