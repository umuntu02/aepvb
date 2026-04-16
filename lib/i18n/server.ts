import { cookies } from "next/headers";
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

// Read the user's language preference from the aepvb-language cookie.
// Falls back to "fr" (site default) when no cookie is set.
// The cookie is written by LanguageProvider on every language change.
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const val = cookieStore.get("aepvb-language")?.value;
  return val === "en" ? "en" : "fr";
}
