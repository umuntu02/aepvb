import { getAllGallery } from "@/lib/db/queries/gallery";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  // DECISION: language selection in GalleryClient is via useTranslations()
  // context which syncs from the URL param — no server-side lang needed here.
  const images = await getAllGallery();
  return <GalleryClient images={images} />;
}
