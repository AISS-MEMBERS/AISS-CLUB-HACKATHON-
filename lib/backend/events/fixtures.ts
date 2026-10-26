import { ClubEvent, EventRow } from "./types";

/**
 * Clearly labelled synthetic test fixtures conforming to the frozen contract.
 *
 * CAUTION: These are synthetic development/test fixtures only.
 * They are not real club records and must not be used as hidden production fallbacks.
 */
export const SYNTHETIC_TEST_EVENTS: ClubEvent[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Introduction to Transformer Architectures",
    description:
      "A hands-on dissection of self-attention mechanisms and practical PyTorch tensor operations. Open to all students with basic Python knowledge.",
    category: "WORKSHOP",
    startsAt: "2026-10-28T18:00:00+03:00",
    endsAt: "2026-10-28T20:00:00+03:00",
    location: "Room 402 // Campus Lab",
    lead: "Lead: Student Research Group",
    imagePath: "/students/gizem/transformer-architecture.jpg",
    publicationStatus: "published",
    isFeatured: true,
    createdAt: "2026-10-20T10:00:00Z",
    updatedAt: "2026-10-20T10:00:00Z",
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    title: "Open-Source LLM Fine-Tuning Sprint",
    description:
      "Collaborative sprint setting up parameter-efficient fine-tuning (LoRA) pipelines on local hardware and university compute clusters.",
    category: "BUILD SESSION",
    startsAt: "2026-11-12T14:00:00+03:00",
    endsAt: "2026-11-12T17:30:00+03:00",
    location: "Room 204 // Engineering Building",
    lead: "Lead: Machine Learning Track",
    imagePath: "/students/gizem/llm-finetuning.jpg",
    publicationStatus: "published",
    isFeatured: false,
    createdAt: "2026-10-21T11:00:00Z",
    updatedAt: "2026-10-21T11:00:00Z",
  },
  {
    id: "c29f6f6b-7d2d-4f05-8e4a-939e1e3b60aa",
    title: "Foundations of Computer Vision with OpenCV",
    description:
      "Covered image transformations, edge detection, and real-time webcam tracking algorithms with complete Python code examples.",
    category: "WORKSHOP",
    startsAt: "2026-10-08T17:00:00+03:00",
    endsAt: "2026-10-08T19:00:00+03:00",
    location: "Room 402 // Campus Lab",
    lead: "Lead: Robotics Working Group",
    imagePath: "/students/gizem/computer-vision.jpg",
    publicationStatus: "published",
    isFeatured: false,
    createdAt: "2026-10-01T09:00:00Z",
    updatedAt: "2026-10-01T09:00:00Z",
  },
  {
    id: "a15c8e22-8344-4cb9-9591-18e38d4f40bb",
    title: "Ethics and Data Governance in Modern AI",
    description:
      "Panel discussion on algorithmic bias, data lineage, and safety considerations in student-led machine learning projects.",
    category: "TALK",
    startsAt: "2026-09-24T18:00:00+03:00",
    endsAt: "2026-09-24T19:30:00+03:00",
    location: "Auditorium B // Main Campus",
    lead: "Lead: Tech & Policy Seminar",
    imagePath: "/students/gizem/ai-ethics.jpg",
    publicationStatus: "published",
    isFeatured: false,
    createdAt: "2026-09-15T08:00:00Z",
    updatedAt: "2026-09-15T08:00:00Z",
  },
  {
    id: "e93d83b1-4122-44df-9aa2-82f50bf73bc2",
    title: "Unpublished Internal ML Architecture Review",
    description:
      "Internal draft event used to verify that draft sessions never leak to public GET queries.",
    category: "WORKSHOP",
    startsAt: "2026-11-20T15:00:00+03:00",
    endsAt: "2026-11-20T17:00:00+03:00",
    location: "Room 101",
    lead: "Lead: Internal Review",
    imagePath: null,
    publicationStatus: "draft",
    isFeatured: false,
    createdAt: "2026-10-25T14:00:00Z",
    updatedAt: "2026-10-25T14:00:00Z",
  },
];

/**
 * Synthetic database rows corresponding to the fixtures above.
 */
export const SYNTHETIC_DATABASE_ROWS: EventRow[] = SYNTHETIC_TEST_EVENTS.map(
  (evt) => ({
    id: evt.id,
    title: evt.title,
    description: evt.description,
    category: evt.category,
    starts_at: evt.startsAt,
    ends_at: evt.endsAt,
    location: evt.location,
    lead: evt.lead,
    image_path: evt.imagePath,
    publication_status: evt.publicationStatus,
    is_featured: evt.isFeatured,
    created_at: evt.createdAt,
    updated_at: evt.updatedAt,
  })
);
