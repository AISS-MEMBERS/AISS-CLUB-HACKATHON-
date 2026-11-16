"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale, Dictionary } from "./types";
import { en } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "aiss_locale";
const COOKIE_KEY = "NEXT_LOCALE";

// Client-side locale store
let activeLocale: Locale = "en";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeLocale(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && (event.newValue === "en" || event.newValue === "tr")) {
      activeLocale = event.newValue as Locale;
      document.documentElement.lang = activeLocale;
      emitChange();
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const cookieRow = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_KEY}=`));
    if (cookieRow) {
      const cookieVal = cookieRow.split("=")[1] as Locale;
      if (cookieVal === "en" || cookieVal === "tr") return cookieVal;
    }
    const storageVal = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (storageVal === "en" || storageVal === "tr") return storageVal;
  } catch {
    // Restricted storage handling
  }
  return null;
}

// Initialize activeLocale on client load once if available
if (typeof window !== "undefined") {
  const initial = getStoredLocale();
  if (initial) {
    activeLocale = initial;
    document.documentElement.lang = initial;
  }
}

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({
  children,
  initialLocale = "en",
}: LanguageProviderProps) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    () => activeLocale,
    () => initialLocale
  );

  const setLocale = useCallback((newLocale: Locale) => {
    if (activeLocale !== newLocale) {
      activeLocale = newLocale;
      try {
        localStorage.setItem(STORAGE_KEY, newLocale);
        document.cookie = `${COOKIE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = newLocale;
      } catch {
        // Storage access handling
      }
      emitChange();
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(activeLocale === "en" ? "tr" : "en");
  }, [setLocale]);

  const t = useMemo<Dictionary>(() => {
    return locale === "tr" ? tr : en;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
    }),
    [locale, setLocale, toggleLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
