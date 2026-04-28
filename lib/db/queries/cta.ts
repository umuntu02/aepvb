import { db } from "@/lib/db";
import { ctaBlock } from "@/lib/db/schema";
import type { CtaBlockRow, NewCtaBlock } from "@/lib/db/schema";

export type { CtaBlockRow };

// DECISION: getCTA always returns the single row (id=1) regardless of status —
// callers check status to decide whether to render the section.
export async function getCTA(): Promise<CtaBlockRow | null> {
  const rows = await db.select().from(ctaBlock).limit(1);
  return rows[0] ?? null;
}

export async function updateCTA(
  data: Partial<Omit<NewCtaBlock, "id">>
): Promise<CtaBlockRow | null> {
  const [row] = await db
    .update(ctaBlock)
    .set({ ...data, updatedAt: new Date() })
    .returning();
  return row ?? null;
}
