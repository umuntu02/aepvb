import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import type { GalleryImage } from "@/lib/constants/mock-data";

function rowToGalleryImage(row: typeof gallery.$inferSelect): GalleryImage {
  return {
    id: String(row.id),
    src: row.src,
    alt: { fr: row.altFr, en: row.altEn },
    category: row.category ?? "other",
    date: row.date
      ? typeof row.date === "string"
        ? row.date
        : String(row.date).split("T")[0]
      : undefined,
  };
}

export async function getAllGallery(): Promise<GalleryImage[]> {
  const rows = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.ordinal), asc(gallery.id));
  return rows.map(rowToGalleryImage);
}
