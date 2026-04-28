import { db } from "@/lib/db";
import { albumPhotos } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export type AlbumPhoto = typeof albumPhotos.$inferSelect;

export async function getPhotosByEventId(eventId: number): Promise<AlbumPhoto[]> {
  return db
    .select()
    .from(albumPhotos)
    .where(eq(albumPhotos.eventId, eventId))
    .orderBy(asc(albumPhotos.ordinal), asc(albumPhotos.id));
}

export async function getPhotosByNewsId(newsId: number): Promise<AlbumPhoto[]> {
  return db
    .select()
    .from(albumPhotos)
    .where(eq(albumPhotos.newsId, newsId))
    .orderBy(asc(albumPhotos.ordinal), asc(albumPhotos.id));
}

export async function getPreviewPhotosByEventId(eventId: number): Promise<AlbumPhoto[]> {
  return db
    .select()
    .from(albumPhotos)
    .where(eq(albumPhotos.eventId, eventId))
    .orderBy(asc(albumPhotos.ordinal), asc(albumPhotos.id))
    .limit(5);
}

export async function getPreviewPhotosByNewsId(newsId: number): Promise<AlbumPhoto[]> {
  return db
    .select()
    .from(albumPhotos)
    .where(eq(albumPhotos.newsId, newsId))
    .orderBy(asc(albumPhotos.ordinal), asc(albumPhotos.id))
    .limit(5);
}

export async function addPhoto(data: {
  eventId?: number;
  newsId?: number;
  image: string;
  altFr: string;
  altEn: string;
  ordinal: number;
}): Promise<AlbumPhoto> {
  const [row] = await db.insert(albumPhotos).values(data).returning();
  return row;
}

// Deletes the record and returns the image path so the caller can remove the file.
export async function removePhoto(photoId: number): Promise<string | null> {
  const [row] = await db
    .select({ image: albumPhotos.image })
    .from(albumPhotos)
    .where(eq(albumPhotos.id, photoId))
    .limit(1);

  if (!row) return null;
  await db.delete(albumPhotos).where(eq(albumPhotos.id, photoId));
  return row.image;
}

export async function updatePhotoAlt(
  photoId: number,
  altFr: string,
  altEn: string
): Promise<void> {
  await db
    .update(albumPhotos)
    .set({ altFr, altEn })
    .where(eq(albumPhotos.id, photoId));
}

export async function reorderPhotos(orderedIds: number[]): Promise<void> {
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(albumPhotos)
        .set({ ordinal: i })
        .where(eq(albumPhotos.id, orderedIds[i]));
    }
  });
}
