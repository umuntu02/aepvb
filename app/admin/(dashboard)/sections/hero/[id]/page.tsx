import { notFound } from "next/navigation";
import { getSlideById } from "@/lib/db/queries/hero";
import HeroForm from "../_components/HeroForm";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await getSlideById(Number(id));
  if (!slide) notFound();
  return <HeroForm initialData={slide} />;
}
