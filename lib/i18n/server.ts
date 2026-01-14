import type { Language, TranslationKey } from "./types";
import { fr } from "./fr";
import { en } from "./en";

const translations: Record<Language, Record<TranslationKey, string>> = {
  fr,
  en,
};

// Server-side utility for server components
export function getTranslations(lang: Language = "fr") {
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = translations[lang][key] || key;
    
    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return translation;
  };
  
  return { t, language: lang };
}
