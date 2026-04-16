import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import type { TeamMember } from "@/lib/constants/mock-data";

function rowToTeamMember(row: typeof teamMembers.$inferSelect): TeamMember {
  return {
    id: String(row.id),
    name: row.name,
    role: { fr: row.roleFr, en: row.roleEn },
    bio: { fr: row.bioFr, en: row.bioEn },
    image: row.photo ?? undefined,
  };
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.ordinal), asc(teamMembers.id));
  return rows.map(rowToTeamMember);
}
