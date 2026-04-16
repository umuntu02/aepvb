import { getAllGallery } from "@/lib/db/queries/gallery";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const images = await getAllGallery();
  return <GalleryClient images={images} />;
}
