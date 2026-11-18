# Internationalization (i18n) Guide — AISS Club Website

This document serves as the official reference guide for the Turkish and English (TR / EN) multilingual system on the AI & Smart Systems (AISS) Club website.

---

## 1. Architecture Overview

The internationalization architecture is intentionally designed to be **lightweight, zero-dependency, and strictly type-safe**, conforming to Next.js App Router and React 19 standards without extra third-party libraries (such as `next-intl` or `react-i18next`).

### File Structure

```
├── lib/
│   └── i18n/
│       ├── types.ts                 # Single source of truth for dictionary schemas and Locale type
│       ├── LanguageContext.tsx       # LanguageProvider, useLanguage hook, storage & cookie sync
│       └── dictionaries/
│           ├── en.ts                # English dictionary
│           └── tr.ts                # Turkish dictionary
├── components/
│   └── shared/
│       └── LanguageSwitcher.tsx     # Reusable accessible toggle component (EN | TR)
├── app/
│   └── layout.tsx                   # Wraps the site in LanguageProvider (English SSR default)
└── docs/
    └── I18N_GUIDE.md                # This guide
```

---

## 2. Core Concepts

### 2.1 Default Language & Persistence
- **Default Locale:** English (`en`).
- **Persistence Mechanisms:**
  1. **HTTP Cookie (`NEXT_LOCALE`):** Saved with `path=/; max-age=31536000; SameSite=Lax`. The current server layout does not read this cookie.
  2. **Browser LocalStorage (`aiss_locale`):** Saved for client-side persistence and cross-tab synchronisation.
- **Language Switching:**
  - Instant client-side re-render without a full page reload.
  - Updates the browser's HTML `<html lang="...">` tag for assistive technologies.
  - Syncs across open tabs via the `window.storage` event listener.

### 2.2 Hydration Safety
- `app/layout.tsx` server-renders English and passes `initialLocale="en"` to `LanguageProvider`.
- After hydration, `LanguageProvider` restores the saved cookie or localStorage choice and updates the page. A brief English-to-Turkish switch may be visible on reload.
- `useSyncExternalStore` keeps the initial client render aligned with the server before restoring the saved choice.

### 2.3 Server vs. Client Component Boundaries
- **Server Components:** `app/page.tsx` and `app/layout.tsx` remain Server Components.
- **Client Components:** Interactive section components that display localized text (`SiteHeader`, `Hero`, `About`, `Events`, `Team`, `Contact`, `Footer`) are marked with `"use client"`. They consume translations via:
  ```tsx
  import { useLanguage } from "@/lib/i18n/LanguageContext";

  export default function MyComponent() {
    const { t, locale, setLocale } = useLanguage();
    return <h1>{t.hero.heading}</h1>;
  }
  ```

### 2.4 Static UI Translations vs. Database Content
- **Static UI Elements:** Headings, descriptions, navigation links, countdown units, form labels, placeholders, validation error alerts, and demo cards are translated across both dictionaries.
- **Dynamic Database Content (Supabase):** In the backend phase, admin-created events (`events` table) contain content authored in a specific language (e.g. Turkish or English). The database schema does not currently maintain multi-column translations (`title_en` / `title_tr`). The UI wrappers (e.g., "Location:", "Lead:", "Free entry for students", "UPCOMING", "ARCHIVED", "WORKSHOP", countdown timer) are fully internationalized, while the event's raw title and description remain as authored in the database.

---

## 3. How to Edit Existing Translations

To modify any user-facing text, edit both dictionary files directly:

1. **English:** `lib/i18n/dictionaries/en.ts`
2. **Turkish:** `lib/i18n/dictionaries/tr.ts`

### Translation Quality Guidelines
- Maintain natural, grammatically sound Turkish suitable for an academic and engineering student club.
- Keep official terminology and proper nouns untranslated where appropriate (*PyTorch, ROS 2, LoRA, SLAM, self-attention, Hugging Face, AISS Club*).
- Never use automatic word-for-word translation.

---

## 4. How to Add a New Translation Key

Follow this 4-step workflow to introduce new text:

### Step 1: Define the Type Contract in `lib/i18n/types.ts`
Locate the relevant section interface (or create a new one) and add your key:

```typescript
// lib/i18n/types.ts
export interface HeroTranslations {
  heading: string;
  description: string;
  exploreEvents: string;
  readAboutUs: string;
  newCalloutText: string; // <-- Add your new key here
}
```

### Step 2: Add the English Text in `lib/i18n/dictionaries/en.ts`
```typescript
// lib/i18n/dictionaries/en.ts
export const en: Dictionary = {
  hero: {
    // ...
    newCalloutText: "Join our open research reading group every Tuesday.",
  },
};
```

### Step 3: Add the Turkish Text in `lib/i18n/dictionaries/tr.ts`
```typescript
// lib/i18n/dictionaries/tr.ts
export const tr: Dictionary = {
  hero: {
    // ...
    newCalloutText: "Her Salı düzenlenen açık araştırma okuma grubumuza katılın.",
  },
};
```

### Step 4: Use in Your Component
```tsx
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  return <p>{t.hero.newCalloutText}</p>;
}
```

TypeScript will immediately alert you if either dictionary misses the key.

---

## 5. How to Verify and Test Both Languages

Always perform these validation steps before submitting a pull request:

### 1. Typecheck and Lint
Run the project's static analysis commands:
```bash
npm run typecheck
npm run lint
```
Both commands must exit with code 0.

### 2. Build Verification
Verify production compilation:
```bash
npm run build
```

### 3. Interactive Testing in Browser
1. Start the dev server:
   ```bash
   npm run dev
   # Or using Docker:
   docker compose up -d
   ```
2. Open `http://localhost:3000`.
3. Verify that the site initially renders in **English**.
4. Click **TR** on the top-right switcher:
   - Content immediately switches to Turkish without a page reload.
   - Inspect the `<html>` element in Developer Tools: verify `lang="tr"`.
5. Refresh the page (F5):
   - The page should switch to the saved Turkish language after hydration without a hydration error. A brief English render is expected with the current client-side design.
6. Click **EN**:
   - Content immediately switches back to English; `lang="en"`.
7. Refresh again:
   - English persists cleanly.
8. Test responsive layouts:
   - Resize to mobile viewport (< 768px).
   - Ensure the switcher in the header bar and the switcher inside the mobile drawer both work.
   - Verify that longer Turkish text does not cause horizontal layout shifts, overlapping text, or broken card heights.

---

## 6. Extending to Additional Languages

To add a third language (e.g., German `"de"`):
1. In `lib/i18n/types.ts`: update `export type Locale = "en" | "tr" | "de";`.
2. Create `lib/i18n/dictionaries/de.ts` implementing `Dictionary`.
3. In `lib/i18n/LanguageContext.tsx`: import `de` and map it in the `t` selector:
   ```typescript
   const t = useMemo<Dictionary>(() => {
     if (locale === "tr") return tr;
     if (locale === "de") return de;
     return en;
   }, [locale]);
   ```
4. Add the button to `components/shared/LanguageSwitcher.tsx`.
