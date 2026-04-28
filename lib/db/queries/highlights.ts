import { db } from "@/lib/db";
import { highlights } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import type { HighlightRow, NewHighlight } from "@/lib/db/schema";

export type { HighlightRow };

export async function getPublishedHighlights(): Promise<HighlightRow[]> {
  return db
    .select()
    .from(highlights)
    .where(eq(highlights.status, "published"))
    .orderBy(asc(highlights.ordinal), asc(highlights.id));
}

export async function getAllHighlights(): Promise<HighlightRow[]> {
  return db
    .select()
    .from(highlights)
    .orderBy(asc(highlights.ordinal), asc(highlights.id));
}

export async function getHighlightById(id: number): Promise<HighlightRow | null> {
  const rows = await db.select().from(highlights).where(eq(highlights.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createHighlight(data: Omit<NewHighlight, "id">): Promise<HighlightRow> {
  const [row] = await db.insert(highlights).values(data).returning();
  return row;
}

export async function updateHighlight(
  id: number,
  data: Partial<Omit<NewHighlight, "id">>
): Promise<HighlightRow | null> {
  const [row] = await db
    .update(highlights)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(highlights.id, id))
    .returning();
  return row ?? null;
}

export async function deleteHighlight(id: number): Promise<void> {
  await db.delete(highlights).where(eq(highlights.id, id));
}

export async function reorderHighlights(orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(highlights)
        .set({ ordinal: index, updatedAt: new Date() })
        .where(eq(highlights.id, id))
    )
  );
}
