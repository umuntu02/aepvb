"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HighlightsProps {
  className?: string;
}

export function Highlights({ className }: HighlightsProps) {
  const { t, language } = useTranslations();
  const { theme } = useTheme();

  const isDark = theme.mode === "dark";
  const isHighContrast = theme.contrast === "high";

  const highlights = [
    {
      icon: Target,
      title: t("about.mission.title"),
      description: t("about.mission.content"),
      color: "blue",
      titleColor: isDark
        ? isHighContrast
          ? "text-blue-300"
          : "text-blue-400"
        : isHighContrast
        ? "text-blue-700"
        : "text-blue-600",
      iconColor: isDark
        ? isHighContrast
          ? "text-blue-300"
          : "text-blue-400"
        : isHighContrast
        ? "text-blue-700"
        : "text-blue-600",
      bgGradient: isDark
        ? isHighContrast
          ? "from-blue-950 via-slate-950 to-blue-950"
          : "from-blue-950/50 via-slate-900 to-blue-950/50"
        : isHighContrast
        ? "from-blue-50 via-slate-50 to-blue-50"
        : "from-blue-50/50 via-slate-100 to-blue-50/50",
      borderGradient: isDark
        ? "from-blue-500 via-blue-400 to-blue-500"
        : isHighContrast
        ? "from-blue-700 via-blue-600 to-blue-700"
        : "from-blue-600 via-blue-500 to-blue-600",
      bottomGlow: isDark
        ? "from-blue-500/20 via-transparent to-transparent"
        : "from-blue-600/10 via-transparent to-transparent",
    },
    {
      icon: Eye,
      title: t("about.vision.title"),
      description: t("about.vision.content"),
      color: "teal",
      titleColor: isDark
        ? isHighContrast
          ? "text-teal-300"
          : "text-teal-400"
        : isHighContrast
        ? "text-teal-700"
        : "text-teal-600",
      iconColor: isDark
        ? isHighContrast
          ? "text-teal-300"
          : "text-teal-400"
        : isHighContrast
        ? "text-teal-700"
        : "text-teal-600",
      bgGradient: isDark
        ? isHighContrast
          ? "from-teal-950 via-slate-950 to-teal-950"
          : "from-teal-950/50 via-slate-900 to-teal-950/50"
        : isHighContrast
        ? "from-teal-50 via-slate-50 to-teal-50"
        : "from-teal-50/50 via-slate-100 to-teal-50/50",
      borderGradient: isDark
        ? "from-teal-500 via-teal-400 to-teal-500"
        : isHighContrast
        ? "from-teal-700 via-teal-600 to-teal-700"
        : "from-teal-600 via-teal-500 to-teal-600",
      bottomGlow: isDark
        ? "from-teal-500/20 via-transparent to-transparent"
        : "from-teal-600/10 via-transparent to-transparent",
    },
  ];

  return (
    <section
      className={cn(
        "py-4 relative overflow-hidden transition-colors duration-300",
        isDark
          ? isHighContrast
            ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
          : isHighContrast
          ? "bg-gradient-to-b from-slate-50 via-white to-slate-50"
          : "bg-gradient-to-b from-slate-100 via-white to-slate-100",
        className
      )}
      aria-label="Mission and Vision"
    >
      {/* Background Image */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-300",
          isDark ? "opacity-10" : "opacity-5"
        )}
      >
        <Image
          src="/img/IMG_20200731_123515.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={30}
          priority={false}
          aria-hidden="true"
        />
        {/* Overlay to ensure content readability */}
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            isDark
              ? isHighContrast
                ? "bg-slate-950/70"
                : "bg-slate-950/60"
              : isHighContrast
              ? "bg-white/80"
              : "bg-white/70"
          )}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            const isVision = highlight.title === t("about.vision.title");
            const isMission = highlight.title === t("about.mission.title");

            return (
              <Card
                key={index}
                className={cn(
                  "relative overflow-hidden border-0 bg-gradient-to-br shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]",
                  highlight.bgGradient
                )}
              >
                {/* Decorative top border */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-opacity duration-300",
                    isHighContrast ? "opacity-100" : "opacity-80",
                    isMission ? highlight.borderGradient : highlight.borderGradient
                  )}
                  style={{
                    background: isMission
                      ? `linear-gradient(to right, ${isDark ? (isHighContrast ? "#60a5fa" : "#60a5fa") : (isHighContrast ? "#1d4ed8" : "#2563eb")}, ${isDark ? (isHighContrast ? "#93c5fd" : "#93c5fd") : (isHighContrast ? "#3b82f6" : "#3b82f6")}, ${isDark ? (isHighContrast ? "#60a5fa" : "#60a5fa") : (isHighContrast ? "#1d4ed8" : "#2563eb")})`
                      : `linear-gradient(to right, ${isDark ? (isHighContrast ? "#5eead4" : "#5eead4") : (isHighContrast ? "#0f766e" : "#0d9488")}, ${isDark ? (isHighContrast ? "#99f6e4" : "#99f6e4") : (isHighContrast ? "#14b8a6" : "#14b8a6")}, ${isDark ? (isHighContrast ? "#5eead4" : "#5eead4") : (isHighContrast ? "#0f766e" : "#0d9488")})`,
                  }}
                />

                <CardHeader className="pb-6 pt-8 px-6 md:px-8">
                  <CardTitle className="relative">
                    {/* Large Title with Icon */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
                      <Icon
                        className={cn(
                          "h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 drop-shadow-lg",
                          highlight.iconColor
                        )}
                        aria-hidden="true"
                      />
                      <h3
                        className={cn(
                          "text-2xl font-black uppercase tracking-tighter leading-none drop-shadow-lg",
                          highlight.titleColor,
                          "relative"
                        )}
                        style={{
                          textShadow: isMission
                            ? isDark
                              ? isHighContrast
                                ? "0 0 20px rgba(147, 197, 253, 0.6), 0 0 40px rgba(147, 197, 253, 0.4), 0 4px 8px rgba(0, 0, 0, 0.7)"
                                : "0 0 20px rgba(96, 165, 250, 0.5), 0 0 40px rgba(96, 165, 250, 0.3), 0 4px 8px rgba(0, 0, 0, 0.5)"
                              : isHighContrast
                              ? "0 0 10px rgba(29, 78, 216, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)"
                              : "0 0 10px rgba(37, 99, 235, 0.3), 0 4px 8px rgba(0, 0, 0, 0.15)"
                            : isDark
                            ? isHighContrast
                              ? "0 0 20px rgba(153, 246, 228, 0.6), 0 0 40px rgba(153, 246, 228, 0.4), 0 4px 8px rgba(0, 0, 0, 0.7)"
                              : "0 0 20px rgba(94, 234, 212, 0.5), 0 0 40px rgba(94, 234, 212, 0.3), 0 4px 8px rgba(0, 0, 0, 0.5)"
                            : isHighContrast
                            ? "0 0 10px rgba(15, 118, 110, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)"
                            : "0 0 10px rgba(13, 148, 136, 0.3), 0 4px 8px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        {highlight.title}
                      </h3>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 md:px-8 pb-8">
                  <CardDescription
                    className={cn(
                      "text-base md:text-lg leading-relaxed text-center max-w-xl mx-auto transition-colors duration-300",
                      isDark
                        ? isHighContrast
                          ? "text-slate-100"
                          : "text-slate-200/90"
                        : isHighContrast
                        ? "text-slate-900"
                        : "text-slate-700"
                    )}
                  >
                    {highlight.description}
                  </CardDescription>
                </CardContent>

                {/* Subtle bottom glow effect */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t pointer-events-none transition-opacity duration-300",
                    isHighContrast ? "opacity-30" : "opacity-20",
                    isMission ? highlight.bottomGlow : highlight.bottomGlow
                  )}
                  style={{
                    background: isMission
                      ? isDark
                        ? `linear-gradient(to top, rgba(96, 165, 250, ${isHighContrast ? 0.3 : 0.2}), transparent, transparent)`
                        : `linear-gradient(to top, rgba(37, 99, 235, ${isHighContrast ? 0.15 : 0.1}), transparent, transparent)`
                      : isDark
                      ? `linear-gradient(to top, rgba(94, 234, 212, ${isHighContrast ? 0.3 : 0.2}), transparent, transparent)`
                      : `linear-gradient(to top, rgba(13, 148, 136, ${isHighContrast ? 0.15 : 0.1}), transparent, transparent)`,
                  }}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
