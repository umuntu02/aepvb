"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroCarousel } from "./HeroCarousel";

interface HeroProps {
  className?: string;
}

const heroImages = [
  {
    src: "/img/IMG_20200731_123515.png",
    mobileSrc: "/img/IMG_20200731_123515x700.png",
    alt: "AEPVB Community",
  },
  {
    src: "/img/IMG_20200731_135408.jpg",
    alt: "AEPVB Activities",
  },
  {
    src: "/img/IMG_20200731_135419.jpg",
    alt: "AEPVB Programs",
  },
  {
    src: "/img/IMG_20200731_140253.jpg",
    alt: "AEPVB Events",
  },
];

export function Hero({ className }: HeroProps) {
  const { t } = useTranslations();

  return (
    <section
      className={`relative min-h-[600px] flex items-center justify-center ${className || ""}`}
      aria-label="Hero section"
    >
      {/* Carousel Background */}
      <div className="absolute inset-0 z-0">
        <HeroCarousel images={heroImages} interval={5000} className="h-full w-full" />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      {/* Content */}
      <div className="container top-45 md:top-35 relative z-20 mx-auto px-4 py-6 text-center">
        <div className="mx-auto max-w-4xl bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-lg">
          <h1 className="mb-4 md:mb-6 text-xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
            {t("home.hero.title")}
          </h1>
          <p className="hidden md:block mb-4 md:mb-8 max-w-3xl mx-auto text-base md:text-lg lg:text-xl text-muted-foreground">
            {t("home.hero.subtitle")}
          </p>
          <div className="grid grid-cols-2 w-[300px]  gap-4 mx-auto justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/about">{t("home.hero.cta")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/donate">{t("home.donate.button")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
