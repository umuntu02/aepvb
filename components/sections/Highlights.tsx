"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, Scale, Users } from "lucide-react";

interface HighlightsProps {
  className?: string;
}

export function Highlights({ className }: HighlightsProps) {
  const { t } = useTranslations();

  const highlights = [
    {
      icon: Heart,
      title: t("about.mission.title"),
      description: t("about.mission.content"),
    },
    {
      icon: Eye,
      title: t("about.vision.title"),
      description: t("about.vision.content"),
    },
  ];

  return (
    <section className={`py-4 bg-gradient-to-b from-primary/5 via-background to-secondary/5 ${className || ""}`} aria-label="Mission and Vision">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {highlight.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
