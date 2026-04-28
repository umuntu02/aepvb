import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import type { HeroSlideRow, NewHeroSlide } from "@/lib/db/schema";

export type { HeroSlideRow };

export async function getPublishedSlides(): Promise<HeroSlideRow[]> {
  return db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.status, "published"))
    .orderBy(asc(heroSlides.ordinal), asc(heroSlides.id));
}

export async function getAllSlides(): Promise<HeroSlideRow[]> {
  return db
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.ordinal), asc(heroSlides.id));
}

export async function getSlideById(id: number): Promise<HeroSlideRow | null> {
  const rows = await db.select().from(heroSlides).where(eq(heroSlides.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createSlide(data: Omit<NewHeroSlide, "id">): Promise<HeroSlideRow> {
  const [row] = await db.insert(heroSlides).values(data).returning();
  return row;
}

export async function updateSlide(
  id: number,
  data: Partial<Omit<NewHeroSlide, "id">>
): Promise<HeroSlideRow | null> {
  const [row] = await db
    .update(heroSlides)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(heroSlides.id, id))
    .returning();
  return row ?? null;
}

export async function deleteSlide(id: number): Promise<void> {
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
}

export async function reorderSlides(orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(heroSlides)
        .set({ ordinal: index, updatedAt: new Date() })
        .where(eq(heroSlides.id, id))
    )
  );
}
