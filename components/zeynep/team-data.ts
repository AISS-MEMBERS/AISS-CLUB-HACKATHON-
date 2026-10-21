import { TeamMember, FaqItem } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'selen-y',
    name: 'Selen Yurdakul',
    monogram: 'SY',
    role: 'Co-Lead & Frontend Developer',
    imageSrc: '/selen.jpeg',
    imagePosition: 'object-[center_40%]',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/yrdklselen',
        ariaLabel: "Selen Yurdakul's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/selenur-yurdakul-9b87a2295?trk=contact-info',
        ariaLabel: "Selen Yurdakul's LinkedIn profile",
      },
    ],
  },
  {
    id: 'mohamad-barakat',
    name: 'Mohamad Barakat',
    monogram: 'MB',
    role: 'Club Lead & Systems Architect',
    imageSrc: '/mohamad-barakat.webp',
    imagePosition: 'object-center',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/vertex-intelligent',
        ariaLabel: "Mohamad Barakat's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/mohamad-barakat-999a27386/',
        ariaLabel: "Mohamad Barakat's LinkedIn profile",
      },
    ],
  },
  {
    id: 'zeynep-a',
    name: 'Zeynep Avcı',
    monogram: 'ZA',
    role: 'Core Team & Frontend Developer',
    imageSrc: '/zeynep.jpeg',
    imagePosition: 'object-[center_32%]',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/zeynepavcii',
        ariaLabel: "Zeynep Avcı's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/zeynep-avci-2bb723376',
        ariaLabel: "Zeynep Avcı's LinkedIn profile",
      },
    ],
  },
  {
    id: 'gizem-a',
    name: 'Gizem Arslan',
    monogram: 'GA',
    role: 'Core Team & Frontend Developer',
    imageSrc: '/gizem.jpg',
    imagePosition: 'object-[45%_35%]',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/GizemArslann',
        ariaLabel: "Gizem Arslan's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/gizem-a-943286388',
        ariaLabel: "Gizem Arslan's LinkedIn profile",
      },
    ],
  },
  {
    id: 'nisa-c',
    name: 'Nisa Bahar Ciğer',
    monogram: 'NC',
    role: 'Core Team & Frontend Developer',
    imageSrc: '/nisa.jpg',
    imagePosition: 'object-[45%_35%]',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/nisabaharciger',
        ariaLabel: "Nisa Bahar Ciğer's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/nisa-bahar-ciğer-462b0b402',
        ariaLabel: "Nisa Bahar Ciğer's LinkedIn profile",
      },
    ],
  },
  {
    id: 'meryem-b',
    name: 'Meryem Bozbuğa',
    monogram: 'MB',
    role: 'Core Team & Frontend Developer',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/meryembozb',
        ariaLabel: "Meryem Bozbuğa's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/meryem-bozbuğa-290512443',
        ariaLabel: "Meryem Bozbuğa's LinkedIn profile",
      },
    ],
  },
  {
    id: 'yagmur-d',
    name: 'Yağmur Doğan',
    monogram: 'YD',
    role: 'Core Team & Frontend Developer',
    imageSrc: '/yagmur.jpeg',
    imagePosition: 'object-[65%_25%]',
    socials: [
      {
        platform: 'github',
        url: 'https://github.com/Yagmur-Dogan',
        ariaLabel: "Yağmur Doğan's GitHub profile",
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/in/yagmur-dogan-105254405',
        ariaLabel: "Yağmur Doğan's LinkedIn profile",
      },
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is AISS Club and who can participate?',
    answer:
      'AISS Club (Artificial Intelligence & Intelligent Systems Club) is an open university laboratory and collaborative study group. Any student interested in machine learning, intelligent systems, software development, or engineering research—regardless of major or year—is welcome to attend our meetings and open build sessions.',
  },
  {
    id: 'faq-2',
    question: 'How do student teams collaborate on this codebase?',
    answer:
      'We follow structured Git workflows: each student engineer owns an assigned training branch (student/<name>) and a dedicated component module. We use local Docker containers for consistent development environments, review git diffs carefully, and submit pull requests targeting main with lead reviews.',
  },
  {
    id: 'faq-3',
    question: 'Does the contact form or website collect any personal data?',
    answer:
      'No. In strict accordance with our team charter (AGENTS.md), the contact form is a front-end educational simulation. Submissions are never transmitted over the network, saved in databases, or logged to browser storage or server files.',
  },
  {
    id: 'faq-4',
    question: 'How can I attend upcoming workshops and hackathons?',
    answer:
      'All upcoming sessions are published in the Events timeline above. You can join our scheduled campus lab sessions directly or connect through our university student channels. No prior registration or fee is required for open study groups.',
  },
  {
    id: 'faq-5',
    question: 'What tools and technologies are we currently exploring?',
    answer:
      'Our web platform is built with Next.js (App Router), TypeScript, Tailwind CSS, and Docker. For intelligence and machine learning projects, our members work with Python, PyTorch, Hugging Face transformers, and local open-weight model architectures.',
  },
];
