"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function CTA({
  title,
  subtitle,
  buttonText,
  buttonHref,
  variant = "primary",
  className,
}: CTAProps) {
  return (
    <section
      className={`py-4  ${
        variant === "primary"
          ? "bg-white text-primary"
          : "bg-primary text-primary-foreground"
      } ${className || ""}`}
      aria-label="Call to action"
    >
      <div className="container mx-auto px-4 py-4 text-center shadow-lg rounded-xl">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="mb-8 max-w-2xl mx-auto text-lg opacity-90">
          {subtitle}
        </p>
        <Button
          asChild
          size="lg"
          variant={variant === "primary" ? "secondary" : "default"}
        >
          <Link href={buttonHref}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}
