"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxPhoto {
  src: string;
  alt: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  initialIndex: number;
  onClose: () => void;
  /** Optional function to format the counter label, e.g. "Image 2 sur 10". */
  label?: (current: number, total: number) => string;
  prevLabel?: string;
  nextLabel?: string;
}

export function Lightbox({
  photos,
  initialIndex,
  onClose,
  label,
  prevLabel = "Précédent",
  nextLabel = "Suivant",
}: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  function navigate(direction: "prev" | "next") {
    if (direction === "prev") {
      setCurrent(current > 0 ? current - 1 : photos.length - 1);
    } else {
      setCurrent(current < photos.length - 1 ? current + 1 : 0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") navigate("prev");
    if (e.key === "ArrowRight") navigate("next");
    if (e.key === "Escape") onClose();
  }

  const caption = label
    ? label(current + 1, photos.length)
    : `${current + 1} / ${photos.length}`;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl p-0"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{caption}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          <Image
            src={photos[current].src}
            alt={photos[current].alt}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate("prev")}
            aria-label={prevLabel}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate("next")}
            aria-label={nextLabel}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-center">
          <p>{photos[current].alt}</p>
          <p className="text-sm opacity-75">{caption}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
