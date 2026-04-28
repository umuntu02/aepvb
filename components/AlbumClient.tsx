"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/Lightbox";

export interface AlbumPhoto {
  src: string;
  alt: string;
}

interface AlbumClientProps {
  photos: AlbumPhoto[];
  imageOfTemplate: string;
  viewImageLabel: string;
  prevLabel: string;
  nextLabel: string;
  emptyMessage?: string;
}

export function AlbumClient({
  photos,
  imageOfTemplate,
  viewImageLabel,
  prevLabel,
  nextLabel,
  emptyMessage,
}: AlbumClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return emptyMessage ? (
      <p className="text-center text-muted-foreground py-12">{emptyMessage}</p>
    ) : null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={viewImageLabel}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          label={(current, total) =>
            imageOfTemplate
              .replace("{current}", String(current))
              .replace("{total}", String(total))
          }
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        />
      )}
    </>
  );
}
