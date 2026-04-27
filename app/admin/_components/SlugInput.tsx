"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { adminFr } from "@/lib/i18n/admin-fr";

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Props {
  value: string;
  onChange: (slug: string) => void;
  sourceText?: string;
  error?: string;
  required?: boolean;
}

export function SlugInput({ value, onChange, sourceText, error, required }: Props) {
  const [manual, setManual] = useState(!!value);

  useEffect(() => {
    if (!manual && sourceText) {
      onChange(generateSlug(sourceText));
    }
  }, [sourceText, manual, onChange]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">
          {adminFr.fieldSlug}
          {required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
        </label>
        <button
          type="button"
          onClick={() => setManual((m) => !m)}
          className="text-xs text-blue-600 hover:underline"
        >
          {manual ? adminFr.fieldSlugLock : adminFr.fieldSlugEdit}
        </button>
      </div>
      <Input
        value={value}
        onChange={(e) => {
          setManual(true);
          onChange(e.target.value.toLowerCase().replace(/\s/g, "-"));
        }}
        readOnly={!manual}
        aria-label={adminFr.fieldSlug}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? "slug-error" : undefined}
        className={`font-mono text-sm ${!manual ? "bg-gray-50 text-gray-500" : ""}`}
        placeholder="identifiant-url"
      />
      {error && (
        <p id="slug-error" role="alert" className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
