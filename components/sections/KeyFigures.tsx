"use client";

import { useTranslations } from "@/components/LanguageProvider";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyFigure {
  id: number;
  icon: string | null;
  valueFr: string;
  valueEn: string;
  labelFr: string;
  labelEn: string;
}

interface KeyFiguresProps {
  figures: KeyFigure[];
  className?: string;
}

// DECISION: dynamic Lucide icon lookup by string name stored in DB.
// Falls back to TrendingUp if the name is unknown or not an icon component.
function DynamicIcon({ name, className }: { name: string | null; className?: string }) {
  if (!name) return null;
  const IconComp = (LucideIcons as Record<string, unknown>)[name] as
    | React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
    | undefined;
  if (!IconComp) return null;
  return <IconComp className={className} aria-hidden />;
}

export function KeyFigures({ figures, className }: KeyFiguresProps) {
  const { language } = useTranslations();

  if (figures.length === 0) return null;

  return (
    <section
      id="highlights"
      className={cn("py-8 bg-primary/5", className)}
      aria-label={language === "fr" ? "Chiffres clés" : "Key figures"}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {figures.map((fig) => {
            const value = language === "en" ? fig.valueEn : fig.valueFr;
            const label = language === "en" ? fig.labelEn : fig.labelFr;
            return (
              <div
                key={fig.id}
                className="flex flex-col items-center gap-2 rounded-xl bg-white border border-border p-6 text-center shadow-sm"
              >
                {fig.icon && (
                  <DynamicIcon
                    name={fig.icon}
                    className="h-8 w-8 text-primary mb-1"
                  />
                )}
                <span className="text-3xl font-black text-primary">{value}</span>
                <span className="text-sm text-muted-foreground leading-snug">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
