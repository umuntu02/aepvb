"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const { t } = useTranslations();

  return (
    <section
      className={`relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-chart-3/5 to-secondary/10 ${className || ""}`}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 z-0">
        {/* Mobile Image */}
        <Image
          src="/img/IMG_20200731_123515x700.png"
          alt="AEPVB Community"
          fill
          className="object-cover md:hidden"
          priority
          sizes="100vw"
        />
        {/* Desktop Image */}
        <Image
          src="/img/IMG_20200731_123515.png"
          alt="AEPVB Community"
          fill
          className="hidden md:block object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="container top-45 relative z-10 mx-auto px-4 py-6 text-center bg-white/80 backdrop-blur-sm rounded-xl">
        <h1 className="mb-4 md:mb-6 text-2xl text-primary font-bold tracking-tight md:text-4xl lg:text-4xl">
          {t("home.hero.title")}
        </h1>
        <p className="mb-4 md:mb-6 max-w-3xl mx-auto font-medium text-md md:text-lg md:text-xl text-foreground">
          {t("home.hero.subtitle")}
        </p>
        <div className="grid grid-cols-2 gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/about">{t("home.hero.cta")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/donate">{t("home.donate.button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
