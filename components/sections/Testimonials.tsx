"use client";

import { useTranslations } from "@/components/LanguageProvider";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  quote: { fr: string; en: string };
  author: string;
  role: { fr: string; en: string };
  image: string;
  category: { fr: string; en: string };
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  className?: string;
}

// Mock testimonials data - you can replace with actual data
const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    quote: {
      fr: "Ma plus grande satisfaction est de voir la réussite",
      en: "My greatest satisfaction is seeing success",
    },
    author: "Parent",
    role: { fr: "Parent", en: "Parent" },
    image: "/img/IMG_8674.JPG",
    category: { fr: "PARENTS", en: "PARENTS" },
  },
  {
    id: "2",
    quote: {
      fr: "Toutes les conditions étaient remplies pour bien étudier",
      en: "All conditions were met for good study",
    },
    author: "Étudiant",
    role: { fr: "Étudiant", en: "Student" },
    image: "/img/IMG_8685.JPG",
    category: { fr: "ETUDIANT", en: "STUDENT" },
  },
];

export function Testimonials({ testimonials = defaultTestimonials, className }: TestimonialsProps) {
  const { t, language } = useTranslations();

  // Display only first 2 testimonials in the main section
  const displayedTestimonials = testimonials.slice(0, 2);

  return (
    <section
      className={cn(
        "py-4 md:py-4 lg:py-20 bg-gradient-to-b from-background via-muted/20 to-background",
        className
      )}
      aria-label={language === "fr" ? "Témoignages" : "Testimonials"}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-wider text-primary md:text-4xl lg:text-5xl">
            {language === "fr"
              ? "RETROUVEZ LES TÉMOIGNAGES "
              : "FIND TESTIMONIALS "}
          </h2>
        </div>

        {/* Testimonials Grid with CTA */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Testimonial Cards */}
          {displayedTestimonials.map((testimonial, index) => {
            const displayText = testimonial.quote[language] || testimonial.quote.fr;
            const truncatedText =
              displayText.length > 50 ? `${displayText.substring(0, 47)}...` : displayText;

            return (
              <div
                key={testimonial.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300",
                  "hover:shadow-2xl hover:scale-[1.02]",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
              >
                {/* Image */}
                <div className="relative h-[400px] w-full md:h-[500px]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />

                  {/* Text Overlay - Top Left */}
                  <div className="absolute left-4 top-4 right-4 z-10">
                    <div className="inline-block rounded-lg bg-[#ff7a7a]/90 px-4 py-3 backdrop-blur-sm shadow-lg">
                      <p className="text-sm font-semibold uppercase leading-tight text-white md:text-base">
                        {truncatedText}
                      </p>
                    </div>
                  </div>

                  {/* Category Badge - Bottom Right */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="rounded-lg bg-[#ff7a7a] px-4 py-2 shadow-lg">
                      <p className="text-xs font-bold uppercase tracking-wide text-white md:text-sm">
                        {testimonial.category[language] || testimonial.category.fr}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* CTA Card - Third Column */}
          <Link
            href="/contact"
            className="group relative flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-[#ff7a7a] p-8 text-center text-white shadow-lg transition-all duration-300 md:min-h-[500px] hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            aria-label={language === "fr" ? "Découvrir tous les témoignages" : "Discover all testimonials"}
          >
            {/* Decorative Icon Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <MessageCircle className="h-32 w-32 md:h-40 md:w-40" aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="mb-6 text-2xl font-bold uppercase tracking-wide md:text-3xl">
                {language === "fr"
                  ? "DÉCOUVREZ TOUS LES TÉMOIGNAGES"
                  : "DISCOVER ALL TESTIMONIALS"}
              </h3>
              <div className="flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowRight className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
