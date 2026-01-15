"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselImage {
  src: string;
  alt: string;
  mobileSrc?: string;
}

interface HeroCarouselProps {
  images: CarouselImage[];
  interval?: number;
  className?: string;
}

export function HeroCarousel({ images, interval = 5000, className }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, isPaused, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div
      className={cn("relative h-full w-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero carousel"
    >
      {/* Images */}
      <div className="relative h-full w-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {/* Mobile Image */}
            {image.mobileSrc && (
              <Image
                src={image.mobileSrc}
                alt={image.alt}
                fill
                className="object-cover md:hidden"
                priority={index === 0}
                sizes="100vw"
              />
            )}
            {/* Desktop Image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={cn(
                "object-cover",
                image.mobileSrc ? "hidden md:block" : ""
              )}
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
