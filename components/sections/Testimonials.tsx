"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: { fr: string; en: string };
  author: string;
  role: { fr: string; en: string };
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

export function Testimonials({ testimonials, className }: TestimonialsProps) {
  // This would typically use useTranslations, but for simplicity, we'll pass translated content
  // In a real implementation, you'd translate the testimonials in the parent component

  return (
    <section className={`py-4 ${className || ""}`} aria-label="Testimonials">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <Quote className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
                <CardDescription className="text-base italic">
                  "{testimonial.quote.fr}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role.fr}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
