import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EventForm from "../_components/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const [row] = await db.select().from(events).where(eq(events.id, numId)).limit(1);
  if (!row) notFound();

  return <EventForm initialData={row} />;
}
