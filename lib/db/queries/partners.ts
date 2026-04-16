import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import type { Partner } from "@/lib/constants/mock-data";

function rowToPartner(row: typeof partners.$inferSelect): Partner {
  return {
    id: String(row.id),
    name: row.name,
    logo: row.logo ?? undefined,
    website: row.website ?? undefined,
  };
}

export async function getAllPartners(): Promise<Partner[]> {
  const rows = await db
    .select()
    .from(partners)
    .orderBy(asc(partners.ordinal), asc(partners.id));
  return rows.map(rowToPartner);
}
