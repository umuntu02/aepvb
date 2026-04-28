import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/db/queries/testimonials";
import TestimonialForm from "../_components/TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getTestimonialById(Number(id));
  if (!row) notFound();
  return <TestimonialForm initialData={row} />;
}
