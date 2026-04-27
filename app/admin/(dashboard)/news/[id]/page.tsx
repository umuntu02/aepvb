import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import NewsForm from "../_components/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const [row] = await db.select().from(news).where(eq(news.id, numId)).limit(1);
  if (!row) notFound();

  return <NewsForm initialData={row} />;
}
