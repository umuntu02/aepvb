import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { eq, asc, and, ne } from "drizzle-orm";
import type { Program, ProgramCategory } from "@/lib/constants/mock-data";

function rowToProgram(row: typeof programs.$inferSelect): Program {
  return {
    id: String(row.id),
    slug: row.slug,
    title: { fr: row.titleFr, en: row.titleEn },
    description: { fr: row.descriptionFr, en: row.descriptionEn },
    fullDescription: { fr: row.fullDescriptionFr, en: row.fullDescriptionEn },
    category: row.category as ProgramCategory,
    image: row.image,
    startDate: row.startDate ?? "",
    status: row.status as Program["status"],
  };
}

export async function getAllPrograms(): Promise<Program[]> {
  const rows = await db
    .select()
    .from(programs)
    .where(eq(programs.published, true))
    .orderBy(asc(programs.id));
  return rows.map(rowToProgram);
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const rows = await db
    .select()
    .from(programs)
    .where(eq(programs.slug, slug))
    .limit(1);
  return rows[0] ? rowToProgram(rows[0]) : null;
}

export async function getRelatedPrograms(
  category: string,
  excludeSlug: string,
  limit = 3
): Promise<Program[]> {
  const rows = await db
    .select()
    .from(programs)
    .where(
      and(
        eq(programs.published, true),
        eq(programs.category, category),
        ne(programs.slug, excludeSlug)
      )
    )
    .orderBy(asc(programs.id))
    .limit(limit);
  return rows.map(rowToProgram);
}
