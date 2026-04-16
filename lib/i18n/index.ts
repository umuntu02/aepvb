"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Language, TranslationKey, Translations } from "./types";
import { fr } from "./fr";
import { en } from "./en";

const translations: Record<Language, Translations> = {
  fr,
  en,
};

const LANGUAGE_STORAGE_KEY = "aepvb-language";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "fr";
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      return stored;
    }
  } catch (error) {
    console.error("Error reading language from localStorage:", error);
  }
  
  // Default to French
  return "fr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // DECISION: URL param takes priority on mount so direct links like
    // /events?lang=en load the correct language without a round-trip.
    const urlLang = searchParams.get("lang");
    const initial = urlLang === "en" || urlLang === "fr" ? urlLang : getStoredLanguage();
    setLanguageState(initial);
    document.cookie = `aepvb-language=${initial}; path=/; max-age=31536000; SameSite=Lax`;
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // DECISION: Sync language whenever the URL ?lang param changes so that
  // router.push(?lang=en) from Header instantly updates all UI strings
  // in the same render cycle as the server re-render.
  useEffect(() => {
    if (!mounted) return;
    const urlLang = searchParams.get("lang");
    if (urlLang === "en" || urlLang === "fr") {
      setLanguageState(urlLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, urlLang);
      document.cookie = `aepvb-language=${urlLang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Also write to a cookie so server components can read the preference
      document.cookie = `aepvb-language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // Update document lang on mount and language change
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[language][key] || key;
    
    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return translation;
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(
    LanguageContext.Provider,
    {
      value: {
        language,
        setLanguage,
        t,
      },
    },
    children
  );
}

export function useTranslations() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Fallback for SSR/prerendering when provider isn't available yet
    const fallbackLang: Language = "fr";
    const fallbackT = (key: TranslationKey, params?: Record<string, string | number>): string => {
      const translation = translations[fallbackLang][key] || key;
      if (params) {
        return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      return translation;
    };
    return {
      language: fallbackLang,
      setLanguage: () => {},
      t: fallbackT,
    };
  }
  return context;
}

