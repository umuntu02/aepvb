import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import GalleryForm from "../_components/GalleryForm";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const [row] = await db.select().from(gallery).where(eq(gallery.id, numId)).limit(1);
  if (!row) notFound();

  return <GalleryForm initialData={row} />;
}
