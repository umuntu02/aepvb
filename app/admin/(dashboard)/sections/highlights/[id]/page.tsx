import { notFound } from "next/navigation";
import { getHighlightById } from "@/lib/db/queries/highlights";
import HighlightForm from "../_components/HighlightForm";

export default async function EditHighlightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getHighlightById(Number(id));
  if (!row) notFound();
  return <HighlightForm initialData={row} />;
}
