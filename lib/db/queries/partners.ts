import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import type { PartnerRow, NewPartner } from "@/lib/db/schema";

export type { PartnerRow };

// Used by public home page — published only
export async function getPublishedPartners(): Promise<PartnerRow[]> {
  return db
    .select()
    .from(partners)
    .where(eq(partners.status, "published"))
    .orderBy(asc(partners.ordinal), asc(partners.id));
}

// Used by admin — all records including drafts
export async function getAllPartners(): Promise<PartnerRow[]> {
  return db
    .select()
    .from(partners)
    .orderBy(asc(partners.ordinal), asc(partners.id));
}

export async function getPartnerById(id: number): Promise<PartnerRow | null> {
  const rows = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPartner(data: Omit<NewPartner, "id">): Promise<PartnerRow> {
  const [row] = await db.insert(partners).values(data).returning();
  return row;
}

export async function updatePartner(
  id: number,
  data: Partial<Omit<NewPartner, "id">>
): Promise<PartnerRow | null> {
  const [row] = await db
    .update(partners)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partners.id, id))
    .returning();
  return row ?? null;
}

export async function deletePartner(id: number): Promise<void> {
  await db.delete(partners).where(eq(partners.id, id));
}

export async function reorderPartners(orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(partners)
        .set({ ordinal: index, updatedAt: new Date() })
        .where(eq(partners.id, id))
    )
  );
}
