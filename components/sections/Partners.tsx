"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { partners } from "@/lib/constants/mock-data";

interface PartnersProps {
  className?: string;
}

export function Partners({ className }: PartnersProps) {
  const { t } = useTranslations();

  return (
    <section className={`py-4 bg-gradient-to-b from-primary/5 via-muted/30 to-background ${className || ""}`} aria-label="Partners">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">{t("footer.social")} - Partenaires</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="rounded-lg border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-sm md:text-base">
                {partner.name}
              </h3>
              {partner.website && partner.website !== "#" && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-primary hover:underline"
                  aria-label={`Visit ${partner.name} website`}
                >
                  {partner.website}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
