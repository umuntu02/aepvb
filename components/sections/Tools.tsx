"use client";

import { useTranslations } from "@/components/LanguageProvider";
import Link from "next/link";
import { HelpCircle, FileText, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolsProps {
  className?: string;
}

export function Tools({ className }: ToolsProps) {
  const { t, language } = useTranslations();

  const tools = [
    {
      id: "faq",
      icon: HelpCircle,
      title: language === "fr" ? "FAQ" : "FAQ",
      description: language === "fr" 
        ? "Questions fréquemment posées" 
        : "Frequently asked questions",
      href: "/contact",
      color: "bg-[#00a9af]", // Teal
      hoverColor: "hover:bg-[#008a8f]",
    },
    {
      id: "dossiers",
      icon: FileText,
      title: language === "fr" ? "DOSSIERS THÉMATIQUES" : "THEMATIC FILES",
      description: language === "fr"
        ? "Ressources par thématique"
        : "Resources by theme",
      href: "/programs",
      color: "bg-[#363662]", // Dark blue
      hoverColor: "hover:bg-[#2a2a4f]",
    },
    {
      id: "ressources",
      icon: BookOpen,
      title: language === "fr" ? "RESSOURCES DOCUMENTAIRES" : "DOCUMENTARY RESOURCES",
      description: language === "fr"
        ? "Bibliothèque de documents"
        : "Document library",
      href: "/programs",
      color: "bg-[#ffc000]", // Yellow/Orange
      hoverColor: "hover:bg-[#e6ad00]",
    },
  ];

  return (
    <section
      className={cn(
        "py-4 md:py-4 lg:py-20 bg-gradient-to-b from-muted/30 via-background to-muted/20",
        className
      )}
      aria-label={language === "fr" ? "Outils pour vous aider" : "Tools to help you"}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="relative mb-6 inline-block">
            {/* Decorative Swoosh - positioned at top-left */}
            <svg
              className="absolute -left-12 -top-6 h-16 w-20 opacity-60 md:h-20 md:w-24"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 50 Q30 10, 50 50 T90 50"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-primary"
              />
              <path
                d="M15 50 Q30 15, 50 50 T85 50"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary/60"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl">
            {language === "fr" ? "POUR VOUS AIDER" : "TO HELP YOU"}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {language === "fr"
              ? "LES OUTILS A.E.P.V.B"
              : "A.E.P.V.B TOOLS"}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 md:gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`${tool.title} - ${tool.description}`}
              >
                <div
                  className={cn(
                    "relative flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl px-6 py-4 text-center text-white shadow-lg transition-all duration-300",
                    "group-hover:scale-105 group-hover:shadow-2xl group-focus:scale-105",
                    tool.color,
                    tool.hoverColor
                  )}
                >
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-bold uppercase tracking-wide md:text-xl">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 text-sm opacity-90 md:text-base">
                    {tool.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-auto flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
