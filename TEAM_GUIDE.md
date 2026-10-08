# 🚀 AISS Club Landing Page — Team Guide & AI Standards

> **Team Size:** 6 Members | **Stack:** Next.js (App Router), TypeScript, Tailwind CSS  
> **Target:** High-converting club landing page + lightweight backend form handler.  
> **Rule #1:** Everyone reads this before prompting their AI or writing code!

---

## 📌 1. Tech Stack & Standards
- **Framework:** Next.js (App Router) + React
- **Language:** TypeScript (`strict: true`, no `any`)
- **Styling:** Tailwind CSS (no external UI component libraries like MUI/Chakra)
- **Backend:** Next.js Route Handlers (`app/api/contact/route.ts`)
- **Package Manager:** `npm` (mandatory: do not use yarn/pnpm to avoid lockfile conflicts)

---

## 👥 2. 6-Member Role & Task Matrix
To eliminate overlapping code and merge conflicts, each member owns one module:

| # | Role / Section | Key Responsibility | Assigned Files |
|---|----------------|--------------------|----------------|
| **1** | **Header & Hero** | Sticky glassmorphism Navbar, Hero title, main CTA | `components/Navbar.tsx`, `Hero.tsx` |
| **2** | **About & Stats** | Club mission, animated counter stats, core pillars | `components/About.tsx`, `Stats.tsx` |
| **3** | **Tracks & Events** | Hackathon timeline, upcoming workshops, schedule | `components/Events.tsx`, `Timeline.tsx` |
| **4** | **Team & FAQ** | Member showcase cards, FAQ accordion, social links | `components/Team.tsx`, `FAQ.tsx` |
| **5** | **Backend & Form** | Join/Contact Form UI + API route handler & validation | `components/ContactForm.tsx`, `app/api/contact/route.ts` |
| **6** | **Lead & Integrator** | Page assembly, SEO metadata, Footer, PR reviews | `app/layout.tsx`, `app/page.tsx`, `components/Footer.tsx` |

---

## 🤖 3. AI Usage Rules (ChatGPT, Antigravity IDE, Claude, Cursor)
Every member uses different AI assistants. **To prevent AI models from generating conflicting patterns**, copy-paste this prompt into your AI model before starting:

```text
[AI SYSTEM INSTRUCTION FOR MY TASK]
You are working on a team project with Next.js (App Router), TypeScript, and Tailwind CSS.
My role is: [INSERT YOUR ROLE HERE, e.g. "Hero & Navigation"]
My assigned files are: [INSERT YOUR FILES HERE]

Strict constraints:
1. Use TypeScript with strict types and clear interfaces (no 'any').
2. Use Tailwind CSS only. Do not invent custom CSS files or install other UI libraries.
3. Keep all code strictly inside my assigned component files.
4. Export clean React functional components: `export default function ComponentName()`.
5. Mobile-first responsive design (sm:, md:, lg: breakpoints).
6. Do NOT touch global config or other members' components.
```

### ⚠️ AI Commandments
- 🚫 **Never blindly run AI `npm install` suggestions:** Always ask Member 6 first.
- 🚫 **Never overwrite full existing files:** Read the AI's diff before applying.
- ✅ **Test locally:** Always run `npm run build` after generating AI code.

---

## 📁 4. Project Directory Structure
```
aiss-club-website/
├── app/
│   ├── api/contact/route.ts  # Member 5: POST handler for form submissions
│   ├── layout.tsx            # Member 6: HTML shell, fonts, SEO metadata
│   ├── page.tsx              # Member 6: Imports and arranges all sections
│   └── globals.css           # Tailwind base styles
├── components/               # Clean, self-contained modular sections
│   ├── Navbar.tsx            # Member 1
│   ├── Hero.tsx              # Member 1
│   ├── About.tsx             # Member 2
│   ├── Stats.tsx             # Member 2
│   ├── Events.tsx            # Member 3
│   ├── Timeline.tsx          # Member 3
│   ├── Team.tsx              # Member 4
│   ├── FAQ.tsx               # Member 4
│   ├── ContactForm.tsx       # Member 5
│   └── Footer.tsx            # Member 6
├── types/                    # Shared TypeScript interfaces (data types)
└── public/                   # Images, club logos, SVG assets
```

---

## 🔌 5. Simple Backend & Data Contract (Member 5 + Integrator)
- **Endpoint:** `POST /api/contact`
- **Request Body (JSON):**
  ```typescript
  export interface ContactPayload {
    name: string;
    email: string;
    interest: 'developer' | 'designer' | 'ai-research' | 'general';
    message: string;
  }
  ```
- **Response:**
  - Success: `200 { success: true, message: "Application received!" }`
  - Error: `400 { success: false, error: "Invalid inputs" }`
*(Keep the backend simple: log to console or append to a local JSON file / database service).*

---

## 🎨 6. Design System Tokens (Tailwind)
Stick to this shared aesthetic so every section looks unified:
- **Theme:** Modern Dark Tech / AI Club vibe (`bg-slate-950` or `bg-zinc-900`)
- **Primary Accent:** Electric Indigo/Purple (`indigo-500` to `violet-600` gradients)
- **Secondary Accent:** Cyan / Teal (`cyan-400`)
- **Card Background:** `bg-slate-900/60 backdrop-blur-md border border-slate-800`
- **Typography:** `font-sans` with high contrast (`text-white` headings, `text-slate-400` body)

---

## 🌿 7. Git Workflow (No Merge Conflicts!)
1. **Pull the latest `main` branch before starting:**
   ```bash
   git checkout main && git pull origin main
   ```
2. **Create your feature branch:**
   ```bash
   git checkout -b feature/your-name-section
   # Example: git checkout -b feature/ahmed-hero
   ```
3. **Commit your work with clear messages:**
   ```bash
   git add .
   git commit -m "feat(hero): build responsive hero section with CTA buttons"
   ```
4. **Push and create a Pull Request (PR):**
   ```bash
   git push origin feature/your-name-section
   ```
5. **Review:** Member 6 reviews and merges into `main`.

---

## 🚀 8. Quick Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local dev server (http://localhost:3000)
npm run dev

# 3. Verify build before opening PR (Must exit with 0 errors)
npm run build
```

---

## ✅ 9. Pre-PR Checklist (Self-Review)
- [ ] Ran `npm run build` with **zero** TypeScript or compile errors.
- [ ] Tested responsive layout on Mobile (375px) and Desktop (1440px).
- [ ] No hardcoded personal tokens or credentials.
- [ ] Replaced generic placeholder text with real AISS Club content.
- [ ] Did not modify files belonging to another teammate.
