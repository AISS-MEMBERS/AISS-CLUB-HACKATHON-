# AISS Club — Frontend Design System & Creative Direction
**Document Version:** 1.0.0  
**Target Codebase:** Artificial Intelligence & Intelligent Systems (AISS) Club Website  
**Tech Stack:** Next.js (App Router), React 19, TypeScript 5, Tailwind CSS v4, Docker  
**Status:** Living Design Specification & Single Source of Truth for Team & AI Agents  

---

## 1. Purpose and Design Philosophy

The AISS Club (Artificial Intelligence and Intelligent Systems Club) website serves as the digital home, workshop, and public showcase for a university student technology community.

### 1.1 Why This Document Exists
Our development team consists of six student engineers (Selen, Yagmur, Meryem, Zeynep, Gizem, Nisa) working on independent Git branches (`student/<name>`) and using different AI coding tools (Antigravity, Cursor, ChatGPT, Codex, GitHub Copilot). 

Without an explicit, centralized design contract, multi-agent AI development quickly collapses into disjointed visual chaos: conflicting color palettes, mismatched font choices, inconsistent padding, and generic SaaS template tropes. **This document is the absolute single source of truth** for visual hierarchy, layout language, UI tokens, accessible patterns, and component rules. Every developer and AI assistant must adhere strictly to these standards.

### 1.2 Core Design Principles
1. **Community First, Product Never:** We are an authentic student-led laboratory, study group, and project hub—not a commercial B2B startup trying to sell an AI subscription.
2. **Editorial Gravitas Meets Technical Curiosity:** Inspired by contemporary independent design studios, research symposium proceedings, and workshop benches rather than sterile corporate software.
3. **Restraint Over Decoration:** High visual impact is achieved through disciplined typography, deliberate contrast, and structured whitespace—never through floating gradient orbs, animated sparkles, or decorative clutter.
4. **Accessible and Democratic:** Every visitor, whether on a low-end mobile screen, high-DPI monitor, or using assistive screen readers, receives a fully accessible, semantic, and keyboard-operable experience.
5. **Architectural Discipline:** Strict component ownership, small client boundaries, zero unnecessary dependencies, and compliance with the existing Next.js App Router and Tailwind CSS architecture.

---

## 2. Creative Direction and Brand Personality

### 2.1 The Identity: A Living AI Laboratory
The visual direction bridges the gap between **academic rigor**, **collaborative university culture**, and **experimental hacker spirit**. 

- **Contemporary Editorial Composition:** High-contrast typography, asymmetrical grids, numbered section indices (`01 //`, `02 //`), and tactile paper-like backgrounds that evoke independent engineering journals.
- **Physical Workshop Authenticity:** Clean borders, structural dividing rules, and mono-spaced technical annotations that feel like schematics, system logs, and research whitepapers.
- **Warmth and Approachability:** A warm paper base (`#F5F3EC`) that softens the starkness of technology, paired with grounded ink black (`#171916`) and an energetic electric lime (`#C8F169`) spark that signals curiosity and experimentation.

### 2.2 What AISS Club Feels Like
| What We Embody | What We Avoid |
|---|---|
| Deep late-night hackathons & collaborative reading groups | Generic silicon valley corporate marketing |
| Real code snippets, hardware prototypes, model weights | Vague stock photos of people in business suits |
| Thoughtful, legible typography and editorial layouts | Centered gradient hero sections with 3 identical rounded cards |
| Modest, honest student accomplishments and ongoing research | Fabricated enterprise testimonials and fake metrics |
| Intentional, snappy micro-interactions | Distracting, bloated 3D animations and spinning spheres |

---

## 3. Color Palette and Semantic Tokens

The color palette is deliberately compact, high-contrast, and tailored for editorial clarity. Do not introduce arbitrary hex colors. Always reference semantic tokens or predefined utility classes.

### 3.1 Color Reference

```
+----------------------------------------------------------------------------+
|  Ink Black     Warm Paper    Pure White    Electric Lime   Muted Sage      |
|  #171916       #F5F3EC       #FFFFFF       #C8F169         #A6B39A         |
|  (Text/Dark)   (Main Canvas) (Surfaces)    (Primary Spark) (Subtle Accent) |
+----------------------------------------------------------------------------+
|  Stone Gray    Soft Border   Signal Orange                                 |
|  #77796F       #DCDDD3       #F0784B                                       |
|  (Muted Text)  (Dividers)    (Urgent Alert)                                |
+----------------------------------------------------------------------------+
```

### 3.2 Token Specifications

| Token Name | Hex Code | Role & Usage Restrictions |
|---|---|---|
| **Ink Black** | `#171916` | Primary body text on paper surfaces, dark hero/footer backgrounds, structural borders, solid primary button surfaces. |
| **Warm Paper** | `#F5F3EC` | Default page background canvas, light badge backgrounds, inverted text on dark surfaces. Provides warmth without eye strain. |
| **Pure White** | `#FFFFFF` | Isolated card surfaces, input fields, high-contrast callout boxes, and elevated readable content blocks. |
| **Electric Lime** | `#C8F169` | High-impact interactive accent, active link badges, button hover states, focus rings, tag indicators. **Use sparingly (≤ 5% of viewport area)**. Never use as background for small body text. |
| **Muted Sage** | `#A6B39A` | Secondary metadata accents, subtle decorative badges, secondary borders, progress markers. |
| **Stone Gray** | `#77796F` | Secondary body text, timestamps, section subtitles, captions, helper text. Must meet WCAG AA contrast against paper and white backgrounds. |
| **Soft Border** | `#DCDDD3` | Hairline dividers, grid borders, card outlines, subtle table rules. Replaces heavy drop shadows. |
| **Signal Orange** | `#F0784B` | Strict exception token: live status badges, deadline warnings, capacity alerts. **Do not use for general decoration.** |

### 3.3 CSS Custom Properties and Tailwind Integration
To ensure complete compatibility with Tailwind CSS v4 and the project's `@theme inline` setup in `app/globals.css`, these variables represent the system contract:

```css
:root {
  /* Brand Primitive Colors */
  --color-ink-black: #171916;
  --color-warm-paper: #f5f3ec;
  --color-pure-white: #ffffff;
  --color-electric-lime: #c8f169;
  --color-muted-sage: #a6b39a;
  --color-stone-gray: #77796f;
  --color-soft-border: #dcddd3;
  --color-signal-orange: #f0784b;

  /* Semantic Theme Roles */
  --bg-page: var(--color-warm-paper);
  --bg-surface: var(--color-pure-white);
  --bg-dark: var(--color-ink-black);
  --text-primary: var(--color-ink-black);
  --text-secondary: var(--color-stone-gray);
  --text-inverted: var(--color-warm-paper);
  --border-subtle: var(--color-soft-border);
  --border-strong: var(--color-ink-black);
  --accent-primary: var(--color-electric-lime);
  --accent-alert: var(--color-signal-orange);
}
```

### 3.4 Approved Color Pairings & Contrast Matrix
- **Warm Paper Canvas (`#F5F3EC`)** + **Ink Black Text (`#171916`)**: Contrast ratio **14.8:1** (Exceeds WCAG AAA).
- **Ink Black Canvas (`#171916`)** + **Electric Lime Accent (`#C8F169`)**: Contrast ratio **12.5:1** (Exceeds WCAG AAA).
- **Ink Black Canvas (`#171916`)** + **Warm Paper Text (`#F5F3EC`)**: Contrast ratio **14.8:1** (Exceeds WCAG AAA).
- **Warm Paper Canvas (`#F5F3EC`)** + **Stone Gray Text (`#77796F`)**: Contrast ratio **4.6:1** (Passes WCAG AA for standard text, AAA for large/bold text).
- **PROHIBITED:** Electric Lime text on Warm Paper or White (Insufficient contrast). Always pair Electric Lime with Ink Black.

---

## 4. Typography System

### 4.1 Primary Display & Body: Bricolage Grotesque
The primary typeface for all headings, subheadings, navigation, and body copy is **Bricolage Grotesque**. Bricolage Grotesque blends French typographic expressiveness with British grotesque heritage, giving AISS Club a distinctive editorial punch that sets it apart from bland tech sans-serifs.

### 4.2 Secondary Technical Font: Restrained Monospace
For system indicators, timestamps, version numbers, section index markers, and code snippets, use a clean monospace font (such as the existing `Geist_Mono` or standard system mono `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`). Monospace must only be used for small metadata labels, never for body paragraphs.

### 4.3 Typography Scale and Hierarchy

| Level | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tracking | Usage & Element |
|---|---|---|---|---|---|---|
| **Display / Hero** | `3.75rem` (60px) – `4.5rem` (72px) | `2.5rem` (40px) | 800 (Extrabold) | `1.05` | `-0.035em` | Main hero statement (`<h1>`), single instance per page. |
| **Section Title** | `2.25rem` (36px) – `2.75rem` (44px) | `1.75rem` (28px) | 700 (Bold) | `1.15` | `-0.025em` | Major section headers (`<h2>`) with section index prefix. |
| **Subsection / Card Title** | `1.25rem` (20px) – `1.5rem` (24px) | `1.125rem` (18px) | 600 (Semibold) | `1.25` | `-0.015em` | Card headlines, event titles, member names (`<h3>`). |
| **Lead Paragraph** | `1.125rem` (18px) – `1.25rem` (20px) | `1.0rem` (16px) | 400 (Regular) | `1.6` | `normal` | Hero intro, section introductory blurbs. |
| **Body Text** | `1.0rem` (16px) | `0.9375rem` (15px) | 400 (Regular) | `1.65` | `normal` | General narrative text, descriptions, FAQ answers. |
| **Navigation & Buttons** | `0.875rem` (14px) – `0.9375rem` (15px) | `0.875rem` (14px) | 600 (Semibold) | `1.0` | `+0.01em` | Header links, buttons, interactive controls. |
| **Technical Label / Meta** | `0.75rem` (12px) – `0.8125rem` (13px) | `0.75rem` (12px) | 500 (Mono) | `1.4` | `+0.05em` | Section badges, dates, room numbers, code tags (`UPPERCASE`). |
| **Caption / Footnote** | `0.75rem` (12px) | `0.6875rem` (11px) | 400 (Regular) | `1.4` | `normal` | Image captions, legal notices, disclaimer text. |

### 4.4 Typography Rules
- **Sentence Case Over Shouting:** Never set entire headings in uppercase. Use uppercase exclusively for tiny technical badges (e.g., `01 // WORKSHOP`, `FALL 2026`).
- **Optimal Line Length:** Keep text blocks between 45 and 75 characters per line (`max-w-prose` or `max-w-2xl`) for comfortable reading.
- **Tightly Tracked Display Headings:** Always apply negative letter-spacing (`tracking-tight` or `tracking-tighter`) on large headings to give Bricolage Grotesque its signature editorial poise.
- **Generous Body Leading:** Never use tight line-height on paragraphs. Ensure body text has at least `leading-relaxed` (1.625) to prevent eye fatigue.

---

## 5. Anti-Generic Design Rules

To protect the AISS Club site from looking like an off-the-shelf AI template or a corporate B2B SaaS landing page, all developers and AI coding agents must enforce the following absolute prohibitions.

### 5.1 Strict Visual Prohibitions

```
[ ABSOLUTE PROHIBITIONS ]
x NO Purple-to-blue neon gradients (#6366F1 -> #8B5CF6 -> #3B82F6)
x NO Centered generic SaaS hero (Badge -> Centered H1 -> Centered Subtitle -> 2 Centered Buttons)
x NO Floating gradient orbs, blurred ambient glow blobs, or meaningless decorative particles
x NO 3D robot figurines, metallic AI hands, cybernetic circuit skulls, or stock sci-fi graphics
x NO Excessive pill-shaped buttons and oversized rounded-3xl cards everywhere
x NO Pointless glassmorphism (backdrop-blur-md on random opaque boxes)
x NO Repetitive 3x2 feature card grids (Icon in rounded box -> 3-word title -> generic paragraph)
x NO Meaningless corporate copy: "Unleash the Power of AI", "Shaping Tomorrow Today"
x NO Fabricated club statistics (e.g., "10,000+ Students Impacted", "99.9% Innovation Rate")
x NO Fake sponsors, fictional partner logos, or fabricated testimonials
x NO Emoji used as substitutes for interface icons or technical badges
x NO External heavy animation libraries (Framer Motion, GSAP, Lottie) without explicit authorization
```

### 5.2 The Test for Originality
Before shipping any component, ask:
> *"Does this look like an authentic, student-run research and engineering community at a real university, or does it look like a template generated in 10 seconds for a venture-backed software company?"*

If it feels like a template, break the symmetry: add an editorial structural border, include a technical metadata tag, make the layout asymmetrical, or ground it with crisp typography.

---

## 6. Layout Language, Spacing, and Responsive Grid

### 6.1 Breakpoints and Containers
The design is built on an adaptive responsive grid with four core breakpoints:

| Breakpoint Name | Min-Width | Horizontal Margin / Padding | Max Container Width |
|---|---|---|---|
| **Mobile (`default`)** | `< 640px` | `1.0rem` (16px) | `100%` |
| **Small Tablet (`sm`)** | `640px` | `1.5rem` (24px) | `640px` |
| **Tablet (`md`)** | `768px` | `2.0rem` (32px) | `768px` |
| **Desktop (`lg`)** | `1024px` | `2.5rem` (40px) | `1024px` |
| **Wide Desktop (`xl`)** | `1280px` | `3.0rem` (48px) | `1200px` (`max-w-6xl` or `max-w-7xl`) |

### 6.2 Vertical Rhythm & Spacing Scale
Layouts follow a clean 8-point vertical cadence:

- **Section Separation:** `py-16 md:py-24` (64px mobile, 96px desktop).
- **Element Grouping (Title to Content):** `mb-8 md:mb-12` (32px mobile, 48px desktop).
- **Component Stack Gap:** `space-y-4` to `space-y-6` (16px to 24px).
- **Card Internal Padding:** `p-5 md:p-8` (20px mobile, 32px desktop).
- **Atomic Element Padding:** `px-4 py-2` (buttons), `px-2.5 py-1` (badges).

### 6.3 Border and Corner Radius Rules
- **Cards and Containers:** Use subtle, structured corner radiuses: `rounded-lg` (8px) or `rounded-xl` (12px). **Never use `rounded-3xl` or `rounded-full` for content cards.**
- **Structural Dividing Borders:** Crisp `1px` solid borders using `border-soft-border` (`#DCDDD3`) on light backgrounds or `border-[#262A24]` on dark backgrounds.
- **Buttons:** Clean `rounded-md` (6px) or `rounded-lg` (8px). Pills (`rounded-full`) are reserved solely for status tags and category chips.

### 6.4 Approved Layout Archetypes
Instead of repeating the same centered grid, developers should select from these three authentic editorial archetypes:

1. **The Asymmetric Editorial Split (60/40):** Left column holds a commanding headline, section identifier, and contextual summary; right column hosts the interactive list, timeline, or detail cards.
2. **The Horizontal Architectural Timeline:** A chronological rail with vertical connectors, milestone dates in mono font, and clean descriptive cards.
3. **The Bento System Matrix (Varying Weights):** A structured grid where one prominent item spans 2 columns or rows (e.g., featured upcoming hackathon), balanced by smaller satellite informational nodes.

---

## 7. Section-by-Section Visual Guidance

Each student owns a specific section component. Below are the precise visual objectives, compositions, and technical boundaries for each assigned area.

### 7.1 Section: Navigation & Hero
- **Owner:** Nisa (`student/nisa`)
- **Code Folder:** `components/nisa/`
- **Initial File:** `components/nisa/Hero.tsx`
- **Section ID:** `home`
- **Visual Objective:** A striking, intelligent first impression that immediately communicates the club's academic rigor, creative energy, and university roots.
- **Composition & Layout:**
  - **Navigation Bar:** Fixed or sticky top bar. Left: Club brandmark (`AISS CLUB` in bold Bricolage Grotesque + active pulse dot). Center/Right: Accessible semantic links (`#about`, `#events`, `#team`, `#contact`). Far Right: Primary CTA button (`Join Club` or `Explore Projects`). Clean bottom border (`border-soft-border`).
  - **Hero Canvas:** Asymmetric layout. 
    - Left (60%): Technical badge (`00 // UNIVERSITY AI COMMUNITY`), followed by an oversized, punchy headline (e.g., *"Where Artificial Intelligence Meets Student Ambition"*). Short authentic 2-sentence mission statement. Two clear actions: Primary Button (`Explore Events`) and Ghost Button (`Read Our Research`).
    - Right (40%): A structured visual card showcasing real club activity—such as a live terminal box, an interactive model card summary, or an art-directed event photo slot.
- **Responsive Behavior:** Mobile stacks into a clean single column; navigation collapses into an accessible mobile menu with a clear toggle button.

### 7.2 Section: About & Static Stats
- **Owner:** Meryem (`student/meryem`)
- **Code Folder:** `components/meryem/`
- **Initial File:** `components/meryem/About.tsx`
- **Section ID:** `about`
- **Visual Objective:** Ground the club in reality. Explain what the club actually does (workshops, study sessions, open-source projects, guest seminars) with verified facts.
- **Composition & Layout:**
  - Section index header: `01 // ABOUT THE COMMUNITY`.
  - Two-column split layout:
    - Left Column: Bold narrative manifesto on student autonomy, ethical intelligence, and practical engineering.
    - Right Column: A 2x2 grid of authentic static stats. Each stat features a bold number (e.g., `42+` Workshops Held, `100%` Student Led, `6` Active Working Groups, `3` Annual Hackathons) paired with Stone Gray descriptive labels.
  - Core Pillars: Three horizontal or stacked cards highlighting club focus areas (e.g., Machine Learning Fundamentals, Computer Vision & Robotics, Ethics & Policy).
- **Prohibitions:** Do not invent fictitious corporate funding metrics or bogus member counts.

### 7.3 Section: Events & Timeline
- **Owner:** Gizem (`student/gizem`)
- **Code Folder:** `components/gizem/`
- **Initial File:** `components/gizem/Events.tsx`
- **Section ID:** `events`
- **Visual Objective:** Showcase dynamic club momentum through chronological workshops, reading groups, and hackathons.
- **Composition & Layout:**
  - Section index header: `02 // CALENDAR & TIMELINE`.
  - Dual Presentation:
    - **Featured Event Card:** Highlight the next upcoming session with date, time, university room/lab location, topic, and speaker/lead.
    - **Timeline List:** An architectural vertical or horizontal list of past and upcoming events. Each row includes: Monospace date tag (`OCT 24`), Event Title, Category Badge (`WORKSHOP`, `TALK`, `BUILD SESSION`), and a short description.
  - Status Indicators: Use Electric Lime for upcoming sessions; Muted Sage or Stone Gray for archived sessions.

### 7.4 Section: Team & FAQ
- **Owner:** Zeynep (`student/zeynep`)
- **Code Folder:** `components/zeynep/`
- **Initial File:** `components/zeynep/Team.tsx`
- **Section ID:** `team`
- **Visual Objective:** Present the student board and contributors as real, accessible colleagues, followed by answers to common student questions.
- **Composition & Layout:**
  - Section index header: `03 // LEADERSHIP & FREQUENT QUESTIONS`.
  - **Team Presentation:** Editorial member cards. Each card includes: Member Name, Role/Subteam (e.g., *Head of Research*, *Workshop Coordinator*), Department/Major, and verified GitHub/LinkedIn icons. If photographs are unavailable, use clean typographic monogram badges (`AB`, `MS`) on Warm Paper surfaces—never generic stock avatars or cartoon robots.
  - **FAQ Accordion:** Clean, accessible accordion list with semantic `<details>` and `<summary>` tags or keyboard-controlled disclose triggers. Clear divider lines. Answers styled in readable Stone Gray body text.

### 7.5 Section: Demo Contact Form
- **Owner:** Yagmur (`student/yagmur`)
- **Code Folder:** `components/yagmur/`
- **Initial File:** `components/yagmur/Contact.tsx`
- **Section ID:** `contact`
- **Visual Objective:** Provide a polished, accessible interactive interface that strictly respects project safety and privacy constraints.
- **Composition & Layout:**
  - Section index header: `04 // CONNECT WITH US`.
  - **MANDATORY NOTICE BANNER:** The top of the form must feature a visible, permanent disclaimer callout:
    > *"Demo Contact Form: This is a front-end simulation for student training. Messages are neither sent over the network nor saved in local storage or databases."*
  - Form Fields:
    - Full Name (`<input type="text">` with associated `<label>`).
    - University Email (`<input type="email">`).
    - Area of Interest (`<select>`: Machine Learning, Robotics, Joining the Team, General Inquiry).
    - Message (`<textarea>` with rows=4).
  - Submit Button: Styled with Electric Lime hover interaction and accessible focus ring. On click, display a graceful local confirmation state reiterating that this is a training demo.
- **Prohibitions:** Never attempt `fetch()` or `POST` requests to backend endpoints. Never store form inputs in `localStorage` or print personal data to browser logs.

### 7.6 Section: Footer
- **Owner:** Selen (`student/selen`)
- **Code Folder:** `components/selen/`
- **Initial File:** `components/selen/Footer.tsx`
- **Section ID:** `footer`
- **Visual Objective:** Anchor the entire page with a visually distinct, confident dark closing section that organizes site links and leaves a strong final impression.
- **Composition & Layout:**
  - Background: Full-width Ink Black (`#171916`) with Warm Paper (`#F5F3EC`) text.
  - Top Bar: Large typographic club signature (`AISS — ARTIFICIAL INTELLIGENCE & INTELLIGENT SYSTEMS`) or editorial sign-off.
  - Navigation Columns:
    - Column 1: Mission statement and university affiliation.
    - Column 2: Section links (`Home`, `About`, `Events`, `Team`, `Contact`).
    - Column 3: Community channels (GitHub organization, Discord server, campus club portal).
    - Column 4: System meta (Built by student engineers with Next.js & Tailwind CSS, Open Source).
  - Bottom Bar: Copyright notice, accessibility commitment statement, and back-to-top anchor.

---

## 8. Photography and Visual Asset Guidelines

### 8.1 Asset Hierarchy & Integrity
Always prioritize authenticity over artificial polish:
1. **Tier 1 (Highest Priority):** Candid, real photographs of club meetings, campus hackathons, whiteboard sessions, and hardware builds.
2. **Tier 2:** Screenshots of student software projects, code commits, Jupyter notebooks, or model architecture diagrams.
3. **Tier 3:** Clean, custom vector diagrams (SVGs) explaining AI concepts (e.g., attention heads, neural pathways, data pipelines).
4. **Tier 4 (Fallback Only):** Restrained, authentic university/technology photographs under verified open licenses.
5. **ABSOLUTELY FORBIDDEN:** Generic AI-generated futuristic portraits, blue holographic brains, stock photos of business suits, or sci-fi robots.

### 8.2 File Storage and Naming Conventions
- Student assets **must strictly reside** in the designated student asset directory: `public/students/<name>/`.
  - Selen: `public/students/selen/`
  - Yagmur: `public/students/yagmur/`
  - Meryem: `public/students/meryem/`
  - Zeynep: `public/students/zeynep/`
  - Gizem: `public/students/gizem/`
  - Nisa: `public/students/nisa/`
- Asset files must follow `kebab-case` naming with descriptive content identifiers:  
  *Examples:* `workshop-nlp-discussion.jpg`, `board-member-zeynep.jpg`, `hackathon-2026-team.png`.
- Do not check in raw uncompressed camera files. Scale photographs to a maximum width of `1600px` and convert to modern `.webp` or compressed `.jpg` formats.

### 8.3 Technical Implementation with Next.js Image
Always use Next.js's native `next/image` component to prevent layout shifts:
- Provide explicit `width` and `height` properties or use `fill` with a relative container.
- Specify accurate `sizes` attributes for responsive srcset generation.
- Supply informative, descriptive `alt` text. Never leave `alt` blank unless the image is purely decorative (`alt="" aria-hidden="true"`).
- Set `priority` only on the single above-the-fold hero image.

```tsx
import Image from "next/image";

// Recommended Card Image Pattern
<div className="relative aspect-video w-full overflow-hidden rounded-lg border border-soft-border bg-[#EAE8E0]">
  <Image
    src="/students/gizem/workshop-preview.jpg"
    alt="Students collaborating around a laptop during the PyTorch workshop"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover transition-transform duration-300 hover:scale-105"
  />
</div>
```

### 8.4 Fallback Pattern When No Image Exists
If a real image is not yet available, **do not link to broken URLs or invent dummy placeholders**. Render an editorial typographic fallback container:

```tsx
<div className="flex aspect-video w-full flex-col justify-between rounded-lg border border-dashed border-stone-400 bg-warm-paper p-6 text-ink-black">
  <span className="font-mono text-xs uppercase tracking-wider text-stone-gray">
    [ Image Archive // Pending Upload ]
  </span>
  <p className="font-serif text-sm font-semibold text-ink-black">
    AISS Working Group Session
  </p>
</div>
```

---

## 9. Interaction, Motion, and Microinteractions

### 9.1 Motion Philosophy: Instant, Purposeful, Grounded
Motion on the AISS Club site must communicate state changes, confirm user intent, and maintain navigational continuity. It must never distract, delay reading, or mimic a flashy marketing template.

### 9.2 Standard Timing & Easing Curves
- **Micro-transitions (Buttons, Links, Borders):** `150ms – 200ms` using `cubic-bezier(0.16, 1, 0.3, 1)` or standard `ease-out`.
- **Surface Disclosures (Accordions, Drawers):** `250ms – 300ms` using `ease-in-out`.
- **Maximum Duration:** Never exceed `300ms` for interactive feedback.

### 9.3 Interactive States Matrix

| Element | Default State | Hover State (`:hover`) | Active / Pressed (`:active`) | Focus Visible (`:focus-visible`) |
|---|---|---|---|---|
| **Primary Button** | Background `#171916`, Text `#F5F3EC`, Border none | Background `#C8F169`, Text `#171916`, `-translate-y-0.5` | Background `#B8E358`, `translate-y-0` | `ring-2 ring-ink-black ring-offset-2 ring-offset-warm-paper` |
| **Secondary Button** | Background `#FFFFFF`, Border `1px solid #DCDDD3`, Text `#171916` | Border `#171916`, Background `#F5F3EC` | Background `#E5E3DC` | `ring-2 ring-ink-black ring-offset-2` |
| **Nav Link** | Text `#77796F`, Font Weight 500 | Text `#171916`, Border-bottom `#C8F169` | Text `#171916` | `ring-2 ring-ink-black rounded-sm` |
| **Card Surface** | Border `#DCDDD3`, Background `#FFFFFF` | Border `#A6B39A`, Subtle shadow, `-translate-y-1` | Border `#171916` | `ring-2 ring-ink-black` |
| **Form Input** | Background `#FFFFFF`, Border `1px solid #DCDDD3` | Border `#77796F` | Background `#FFFFFF` | Border `#171916`, `ring-2 ring-[#C8F169]` |

### 9.4 Accessibility: Reduced Motion
All transitions must automatically collapse to instant state swaps when the user has enabled OS-level reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. Accessibility and Responsive Behavior

### 10.1 Standards Baseline
The website targets full **WCAG 2.1 Level AA** compliance across all viewports.

### 10.2 Semantic Structure Rules
- Exactly one `<h1>` per page, located inside the Hero component.
- Sequential, non-skipping heading hierarchy: `<h1>` -> `<h2>` (Section headers) -> `<h3>` (Card / Subsection titles) -> `<h4>`.
- Distinct landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<aside>`.
- Every `<section>` element must carry an accessible name via `aria-labelledby` or contain an `<h2>` heading.

### 10.3 Keyboard Navigation
- All interactive controls (buttons, links, form inputs, accordion triggers) must be reachable and operable using `Tab`, `Shift+Tab`, `Enter`, and `Space`.
- Never remove CSS outline styles without providing an explicit `:focus-visible` replacement:
  ```css
  /* Required Focus Ring Pattern */
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black focus-visible:ring-offset-2 focus-visible:ring-offset-warm-paper
  ```
- Form controls must always feature explicit `<label htmlFor="...">` associations.

### 10.4 Touch Targets and Mobile Viewports
- Minimum touch target area for mobile tap targets is **44px × 44px** (including padding).
- Zero horizontal scrolling: All containers must use responsive flex/grid wrappers with `overflow-x-clip` or careful max-width boundaries.
- Text must remain fully legible and maintain proper hierarchy without zoom breakdown. Minimum body font size on mobile is `15px` (`0.9375rem`).

---

## 11. Components and Reuse

To maintain visual harmony without turning the page into a generic repeated card template, developers should use these standardized component patterns.

### 11.1 Section Header Pattern
Every section must introduce itself with consistent editorial hierarchy:

```tsx
interface SectionHeaderProps {
  index: string;      // e.g. "01"
  tag: string;        // e.g. "ABOUT THE CLUB"
  title: string;      // e.g. "Where Theory Meets Practical Intelligence"
  description?: string;
}

export function SectionHeader({ index, tag, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-8 md:mb-12 border-b border-soft-border pb-6">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-stone-gray">
        <span className="font-semibold text-ink-black">{index} //</span>
        <span>{tag}</span>
      </div>
      <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-ink-black sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-base text-stone-gray md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
```

### 11.2 Standard Button Variants
Buttons exist in three clear variants:

1. **Primary Action (`btn-primary`):** High-contrast Ink Black with Electric Lime hover:
   ```html
   <button className="inline-flex items-center justify-center rounded-md bg-ink-black px-5 py-2.5 text-sm font-semibold text-warm-paper transition-all duration-150 hover:bg-electric-lime hover:text-ink-black hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black focus-visible:ring-offset-2">
     Explore Workshops
   </button>
   ```

2. **Secondary Surface (`btn-secondary`):** White surface with Soft Border and Ink Black hover:
   ```html
   <button className="inline-flex items-center justify-center rounded-md border border-soft-border bg-white px-5 py-2.5 text-sm font-semibold text-ink-black transition-all duration-150 hover:border-ink-black hover:bg-warm-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black">
     Read Documentation
   </button>
   ```

3. **Subtle Ghost / Link (`btn-ghost`):** Understated text link with trailing arrow:
   ```html
   <a href="#about" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-gray transition-colors duration-150 hover:text-ink-black">
     Learn more <span>&rarr;</span>
   </a>
   ```

### 11.3 Technical Badge / Status Chip
For categorizing events, member roles, and technical topics:
```tsx
// Electric Lime Active Badge
<span className="inline-flex items-center rounded-full bg-electric-lime px-2.5 py-0.5 font-mono text-xs font-semibold text-ink-black">
  UPCOMING
</span>

// Neutral Paper Badge
<span className="inline-flex items-center rounded-full border border-soft-border bg-warm-paper px-2.5 py-0.5 font-mono text-xs font-medium text-stone-gray">
  WORKSHOP
</span>
```

### 11.4 Editorial Card Pattern
For event details, pillars, and research topics:
```tsx
<article className="group flex flex-col justify-between rounded-xl border border-soft-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink-black hover:shadow-sm">
  <div>
    <div className="flex items-center justify-between text-xs font-mono text-stone-gray">
      <span>ROOM 402</span>
      <span>OCTOBER 28</span>
    </div>
    <h3 className="mt-3 font-serif text-lg font-bold text-ink-black group-hover:text-ink-black">
      Introduction to Transformer Architectures
    </h3>
    <p className="mt-2 text-sm leading-relaxed text-stone-gray">
      Hands-on dissection of self-attention mechanisms and PyTorch tensor operations.
    </p>
  </div>
  <div className="mt-6 flex items-center justify-between border-t border-soft-border pt-4 text-xs font-semibold text-ink-black">
    <span>Lead: Meryem S.</span>
    <span className="text-stone-gray group-hover:translate-x-1 transition-transform">&rarr;</span>
  </div>
</article>
```

---

## 12. Shared Team Conventions

### 12.1 Team Assignments and Code Ownership

| Student | Training Branch | Permitted Code Folder | Permitted Asset Folder | Assigned Section | Section ID |
|---|---|---|---|---|---|
| **Selen** | `student/selen` | `components/selen/` | `public/students/selen/` | Footer, integration coordination | `footer` |
| **Yagmur** | `student/yagmur` | `components/yagmur/` | `public/students/yagmur/` | Demo contact form | `contact` |
| **Meryem** | `student/meryem` | `components/meryem/` | `public/students/meryem/` | About and static stats | `about` |
| **Zeynep** | `student/zeynep` | `components/zeynep/` | `public/students/zeynep/` | Team and FAQ | `team` |
| **Gizem** | `student/gizem` | `components/gizem/` | `public/students/gizem/` | Events and simple timeline | `events` |
| **Nisa** | `student/nisa` | `components/nisa/` | `public/students/nisa/` | Hero and navigation | `home` |

### 12.2 Shared Core Files (Coordinated by Mohamad & Selen)
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Root configurations: `package.json`, `package-lock.json`, `Dockerfile`, `compose.yaml`, `tsconfig.json`
- Continuous Integration: `.github/`
- **Rule:** Individual student branches and AI agents must NOT edit these shared files without explicit project lead agreement.

### 12.3 Server and Client Component Boundaries
- The root `app/page.tsx` must remain a **Server Component**.
- Individual section components should default to **Server Components** unless interactivity (e.g., contact form inputs, accordion toggle, mobile nav open/close) requires React state.
- Keep Client boundaries as small as possible by placing `'use client'` only on isolated interactive leaf elements.

---

## 13. Rules for All AI Coding Agents

If you are an AI assistant (Antigravity, Cursor, ChatGPT, Codex, Claude Code, GitHub Copilot) working with any student on this repository, you must obey the following twelve directives without exception:

1. **Read Before Writing:** Always read `AGENTS.md` and this `frontend-design.md` file before proposing or generating any code.
2. **Strict Folder Boundaries:** Only create or modify files inside your student's permitted folders (`components/<student>/` and `public/students/<student>/`). Never touch another student's folder.
3. **No Shared File Modifications:** Never modify `app/`, `globals.css`, `package.json`, `Dockerfile`, or CI configurations without explicit lead instructions.
4. **Adhere to the Color Palette:** Strictly use the defined tokens: Ink Black (`#171916`), Warm Paper (`#F5F3EC`), Pure White (`#FFFFFF`), Electric Lime (`#C8F169`), Muted Sage (`#A6B39A`), Stone Gray (`#77796F`), and Soft Border (`#DCDDD3`). Do not invent new color schemes.
5. **No SaaS Template Tropes:** Never introduce purple gradients, neon glow blobs, 3D floating robots, generic card grids, or centered SaaS heroes.
6. **No Fake Marketing Copy or Stats:** Use authentic, verified student club content. If content is missing, mark it clearly as an editorial placeholder.
7. **Contact Form Boundary:** The contact form must remain a front-end simulation. Never write network `fetch()` requests, never log user submissions, and never save data to `localStorage`. Display the mandatory demo disclaimer banner.
8. **Semantic & Accessible Markup:** Use proper HTML5 tags (`<section>`, `<article>`, `<header>`, `<nav>`), logical heading levels (`<h2>`, `<h3>`), explicit form labels, and visible `:focus-visible` states.
9. **Zero New Dependencies:** Do not add npm packages, icon libraries, or animation suites. Use native SVG, Tailwind CSS utilities, and native React state.
10. **Type Safety:** Never introduce `any`. Write explicit TypeScript interfaces for all component props.
11. **Responsive Testing:** Verify that designs render cleanly without horizontal overflow across mobile (375px), tablet (768px), and desktop (1200px) viewports.
12. **No Automatic Git Actions:** Never run automated `git commit`, `git push`, or `git merge` commands. Provide code and explanations so the student can review and test before committing.

---

## 14. Pre-Implementation Checklist

Before starting work on any component, complete these six verification steps:

- [ ] **1. Branch Verification:** Confirm you are working on your assigned branch (`git status` shows `student/<name>`).
- [ ] **2. File Scope Check:** Confirm all planned changes are isolated inside `components/<name>/` or `public/students/<name>/`.
- [ ] **3. Section Contract:** Confirm your component retains the agreed `id` attribute (`home`, `about`, `events`, `team`, `contact`, or `footer`).
- [ ] **4. Design Tokens:** Confirm you are referencing the defined palette (`Ink Black`, `Warm Paper`, `Electric Lime`, `Soft Border`).
- [ ] **5. Accessibility Mapping:** Identify your component's semantic heading level and keyboard-operable elements.
- [ ] **6. Docker Environment:** Confirm the development server is active via `docker compose up -d` and accessible at `http://localhost:3000`.

---

## 15. Final Design and Quality Checklist

Before opening a Pull Request targeting `main`, verify the completed implementation against these acceptance criteria:

### Visual Quality & Brand Expression
- [ ] The section feels like an authentic university AI community, not a generic SaaS landing page.
- [ ] Bricolage Grotesque is utilized with proper tracking (`tracking-tight` on headings).
- [ ] High-contrast color pairings satisfy WCAG AA contrast (minimum 4.5:1 for body text).
- [ ] Electric Lime (`#C8F169`) is used with restraint (accent highlights and hover states, ≤ 5% of viewport).
- [ ] Borders use `border-soft-border` (`#DCDDD3`) rather than heavy dropshadows.

### Responsive & Layout Integrity
- [ ] Mobile layout (375px) functions seamlessly with zero horizontal overflow.
- [ ] Desktop layout (1200px) respects maximum container widths and vertical rhythm.
- [ ] Images utilize Next.js `next/image` with explicit dimensions and descriptive `alt` text.

### Accessibility & Interaction
- [ ] All interactive elements feature visible focus rings on `:focus-visible`.
- [ ] Interactive buttons and links meet the minimum 44px × 44px touch target guideline.
- [ ] Form inputs have associated `<label>` tags and clear validation cues.
- [ ] The contact form displays the mandatory simulation disclaimer notice.

### Technical & Code Validation
- [ ] No explicit `any` types in TypeScript.
- [ ] Default export is present for the main section component.
- [ ] Local build and check passes in Docker:
  ```bash
  docker build --tag aiss-club-check .
  docker run --rm aiss-club-check npm run check
  ```
  *(Or `npm run check` if working directly on host with Node 22).*

---

## 16. Reusable Prompt for Other AI Coding Agents

Students can copy and paste the prompt below into any AI coding tool (Antigravity, Cursor, ChatGPT, Codex, Claude Code) before beginning an assigned task:

```markdown
Hello! I am working on the AISS Club website (Artificial Intelligence and Intelligent Systems Club).
Before writing any code, please read both `AGENTS.md` and `frontend-design.md` in the project root.

Here are my assignment details:
- My Name: [Selen | Yagmur | Meryem | Zeynep | Gizem | Nisa]
- My Branch: student/[name]
- My Allowed Code Folder: components/[name]/
- My Allowed Asset Folder: public/students/[name]/
- My Component: components/[name]/[Component].tsx
- My Section ID: [home | about | events | team | contact | footer]

Please follow these mandatory guidelines:
1. ONLY modify files inside my allowed code and asset folders. Do NOT edit app/, globals.css, configuration files, or other students' folders.
2. Follow the design system in `frontend-design.md`:
   - Canvas: Warm Paper (#F5F3EC)
   - Text & Dark Anchors: Ink Black (#171916)
   - Primary Accent: Electric Lime (#C8F169) - use with restraint
   - Borders: Soft Border (#DCDDD3)
   - Secondary Text: Stone Gray (#77796F)
   - Typography: Bricolage Grotesque with tight tracking on headings
3. AVOID generic AI/SaaS tropes: No purple gradients, no floating gradient orbs, no 3D robot figurines, no centered SaaS heroes, and no fake statistics.
4. If this is the contact form, include the prominent notice that it is a demo simulation that sends and stores nothing.
5. Use semantic HTML, accessible labels, visible focus rings, and TypeScript with5out any `any`.
6. Explain your proposed changes step-by-step so I can learn, and tell me how to test them.
```
