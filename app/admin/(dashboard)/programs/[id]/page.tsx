import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProgramForm from "../_components/ProgramForm";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const [row] = await db.select().from(programs).where(eq(programs.id, numId)).limit(1);
  if (!row) notFound();

  return <ProgramForm initialData={row} />;
}
