"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredLanguage();
    setLanguageState(stored);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang;
      }
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
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

