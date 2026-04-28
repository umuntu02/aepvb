"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/Lightbox";
import { useTranslations } from "@/components/LanguageProvider";
import type { GalleryImage } from "@/lib/constants/mock-data";
import Image from "next/image";

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const { t, language } = useTranslations();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = Array.from(new Set(images.map((img) => img.category)));
  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const lightboxPhotos = filteredImages.map((img) => ({
    src: img.src,
    alt: img.alt[language],
  }));

  return (
    <div className="container mx-auto px-4 ">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("gallery.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("gallery.subtitle")}</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
        >
          {t("common.all")}
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredImages.map((image, index) => (
          <Card
            key={image.id}
            className="group relative overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedImage(index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={t("gallery.viewImage")}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={image.src}
                alt={image.alt[language]}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Badge variant="secondary">{image.category}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {selectedImage !== null && (
        <Lightbox
          photos={lightboxPhotos}
          initialIndex={selectedImage}
          onClose={() => setSelectedImage(null)}
          label={(current, total) =>
            t("gallery.imageOf", {
              current: current.toString(),
              total: total.toString(),
            })
          }
          prevLabel={t("common.previous")}
          nextLabel={t("common.next")}
        />
      )}
    </div>
  );
}
