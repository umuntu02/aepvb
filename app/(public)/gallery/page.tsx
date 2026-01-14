"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "@/components/LanguageProvider";
import { galleryImages } from "@/lib/constants/mock-data";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const { t, language } = useTranslations();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = Array.from(new Set(galleryImages.map((img) => img.category)));
  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    if (direction === "prev") {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : filteredImages.length - 1);
    } else {
      setSelectedImage(selectedImage < filteredImages.length - 1 ? selectedImage + 1 : 0);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImage === null) return;
    if (e.key === "ArrowLeft") navigateImage("prev");
    if (e.key === "ArrowRight") navigateImage("next");
    if (e.key === "Escape") closeLightbox();
  };

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
            onClick={() => openLightbox(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(index);
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

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <Dialog open={true} onOpenChange={closeLightbox}>
          <DialogContent
            className="max-w-5xl p-0"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>
                {t("gallery.imageOf", {
                  current: (selectedImage + 1).toString(),
                  total: filteredImages.length.toString(),
                })}
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt[language]}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => navigateImage("prev")}
                aria-label={t("common.previous")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => navigateImage("next")}
                aria-label={t("common.next")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded">
              <p>{filteredImages[selectedImage].alt[language]}</p>
              <p className="text-sm text-muted-foreground">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
