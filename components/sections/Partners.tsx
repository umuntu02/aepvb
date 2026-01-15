"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { partners } from "@/lib/constants/mock-data";
import { ExternalLink, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnersProps {
  className?: string;
}

export function Partners({ className }: PartnersProps) {
  const { t, language } = useTranslations();

  return (
    <section
      className={cn(
        "py-4 md:py-4 lg:py-20 bg-gradient-to-b from-background to-primary/5",
        className
      )}
      aria-label={language === "fr" ? "Partenaires" : "Partners"}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wider text-primary md:text-4xl lg:text-5xl">
            {language === "fr" ? "NOS PARTENAIRES" : "OUR PARTNERS"}
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partners.map((partner) => {
            const isExternalLink =
              partner.website && partner.website !== "#" && partner.website.startsWith("http");

            const PartnerCard = (
              <div
                className={cn(
                  "group flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-border bg-card p-6 text-center shadow-sm transition-all duration-300",
                  "hover:border-primary hover:shadow-lg hover:scale-105",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                  <Building2 className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Partner Name */}
                <h3 className="mb-2 text-sm font-semibold leading-tight text-foreground md:text-base">
                  {partner.name}
                </h3>

                {/* External Link Indicator */}
                {isExternalLink && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {language === "fr" ? "Visiter le site" : "Visit website"}
                    </span>
                  </div>
                )}
              </div>
            );

            if (isExternalLink) {
              return (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none"
                  aria-label={`${partner.name} - ${language === "fr" ? "Visiter le site web" : "Visit website"}`}
                >
                  {PartnerCard}
                </a>
              );
            }

            return (
              <div key={partner.id} className="block">
                {PartnerCard}
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground md:text-base">
            {language === "fr"
              ? "Nous collaborons avec ces organisations pour promouvoir les droits des personnes vulnérables."
              : "We collaborate with these organizations to promote the rights of vulnerable people."}
          </p>
        </div>
      </div>
    </section>
  );
}
