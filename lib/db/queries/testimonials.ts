import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import type { TestimonialRow, NewTestimonial } from "@/lib/db/schema";

export type { TestimonialRow };

export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "published"))
    .orderBy(asc(testimonials.ordinal), asc(testimonials.id));
}

export async function getAllTestimonials(): Promise<TestimonialRow[]> {
  return db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.ordinal), asc(testimonials.id));
}

export async function getTestimonialById(id: number): Promise<TestimonialRow | null> {
  const rows = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createTestimonial(data: Omit<NewTestimonial, "id">): Promise<TestimonialRow> {
  const [row] = await db.insert(testimonials).values(data).returning();
  return row;
}

export async function updateTestimonial(
  id: number,
  data: Partial<Omit<NewTestimonial, "id">>
): Promise<TestimonialRow | null> {
  const [row] = await db
    .update(testimonials)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();
  return row ?? null;
}

export async function deleteTestimonial(id: number): Promise<void> {
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function reorderTestimonials(orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(testimonials)
        .set({ ordinal: index, updatedAt: new Date() })
        .where(eq(testimonials.id, id))
    )
  );
}
