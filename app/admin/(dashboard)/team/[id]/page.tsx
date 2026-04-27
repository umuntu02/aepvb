import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import TeamForm from "../_components/TeamForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const [row] = await db.select().from(teamMembers).where(eq(teamMembers.id, numId)).limit(1);
  if (!row) notFound();

  return <TeamForm initialData={row} />;
}
