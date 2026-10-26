/**
 * DEMO Test Fixtures - Clearly labelled for UI development only.
 * IMPORTANT: According to NISA-ADMIN-DASHBOARD.md:
 * "Use synthetic fixture data only to develop components, explicitly labelled 'DEMO - not connected'."
 * No production fallback and no fake timeout saving.
 */

import { ClubEvent, ContactMessage } from "./types";

export const DEMO_MODE_NOTICE = "DEMO - not connected (API bağlantısı henüz kurulmadı)";

export const DEMO_EVENTS: ClubEvent[] = [
  {
    id: "demo-event-1",
    title: "Yapay Zeka Etiği ve Geleceğin Teknolojileri",
    description:
      "Yapay zeka modellerinin toplum üzerindeki etkileri, veri gizliliği ve etik sorumluluklar üzerine kapsamlı bir tartışma ve atölye çalışması.",
    category: "TALK",
    startsAt: "2026-11-05T15:00:00.000Z", // 18:00 Europe/Istanbul
    endsAt: "2026-11-05T17:00:00.000Z", // 20:00 Europe/Istanbul
    location: "Mühendislik Fakültesi Amfi 1",
    lead: "Dr. Elif Yılmaz",
    imagePath: "/students/gizem/ai-ethics.jpg",
    publicationStatus: "published",
    isFeatured: true,
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "demo-event-2",
    title: "Görüntü İşleme ve Computer Vision Pratiği",
    description:
      "OpenCV ve PyTorch kullanarak nesne tespiti modelleri geliştirme, pratik kodlama oturumu.",
    category: "WORKSHOP",
    startsAt: "2026-11-12T11:00:00.000Z", // 14:00 Europe/Istanbul
    endsAt: "2026-11-12T14:00:00.000Z", // 17:00 Europe/Istanbul
    location: "Bilgisayar Lab 3",
    lead: "Ahmet Demir",
    imagePath: "/students/gizem/computer-vision.jpg",
    publicationStatus: "draft",
    isFeatured: false,
    createdAt: "2026-10-22T12:00:00.000Z",
    updatedAt: "2026-10-22T12:00:00.000Z",
  },
  {
    id: "demo-event-3",
    title: "Büyük Dil Modelleri (LLM) Fine-Tuning Seansı",
    description:
      "Açık kaynaklı dil modellerini LoRA ve QLoRA teknikleri ile özelleştirme hands-on oturumu.",
    category: "BUILD SESSION",
    startsAt: "2026-11-19T13:00:00.000Z", // 16:00 Europe/Istanbul
    endsAt: "2026-11-19T16:00:00.000Z", // 19:00 Europe/Istanbul
    location: "AISS Çalışma Alanı",
    lead: "Zeynep Kaya",
    imagePath: "/students/gizem/llm-finetuning.jpg",
    publicationStatus: "archived",
    isFeatured: false,
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-18T18:00:00.000Z",
  },
];

export const DEMO_MESSAGES: ContactMessage[] = [
  {
    id: "demo-msg-1",
    fullName: "Ali Vural",
    universityEmail: "ali.vural@std.bogazici.edu.tr",
    areaOfInterest: "Machine Learning",
    message:
      "Merhaba, kulübün düzenlediği derin öğrenme araştırma grubuna katılmak istiyorum. Başvuru süreci hakkında bilgi alabilir miyim?",
    status: "new",
    createdAt: "2026-10-26T14:30:00.000Z",
  },
  {
    id: "demo-msg-2",
    fullName: "Selin Çelik",
    universityEmail: "selin.celik@std.itu.edu.tr",
    areaOfInterest: "Robotics",
    message:
      "Robotik kol projenizde ROS2 mi kullanıyorsunuz? Donanım ekibine katkı sunmak isterim.",
    status: "read",
    createdAt: "2026-10-25T11:15:00.000Z",
  },
  {
    id: "demo-msg-3",
    fullName: "Mehmet Akif",
    universityEmail: "mehmet.akif@std.metu.edu.tr",
    areaOfInterest: "Joining the Team",
    message:
      "Tasarım ve sosyal medya ekibinde görev almak istiyorum, portfolyomu iletebileceğim bir adres var mı?",
    status: "archived",
    createdAt: "2026-10-24T08:45:00.000Z",
  },
];
