import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getEventBySlug } from "@/lib/db/queries/events";
import { getPhotosByEventId } from "@/lib/db/queries/albums";
import { getTranslations, getCurrentLang } from "@/lib/i18n/server";
import { AlbumClient } from "@/components/AlbumClient";
import { generateMetadata as genMeta } from "@/lib/metadata";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EventPhotosPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: EventPhotosPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return genMeta({
      title: "Album introuvable",
      description: "",
      lang: "fr",
      path: `/events/${slug}/photos`,
    });
  }
  const lang = getCurrentLang(await searchParams);
  return genMeta({
    title: `${event.title[lang]} — ${lang === "fr" ? "Photos" : "Photos"}`,
    description: event.description[lang],
    lang,
    path: `/events/${slug}/photos`,
  });
}

export default async function EventPhotosPage({
  params,
  searchParams,
}: EventPhotosPageProps) {
  const { slug } = await params;
  const lang = getCurrentLang(await searchParams);
  const { t } = getTranslations(lang);

  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const photos = await getPhotosByEventId(parseInt(event.id));

  // Redirect to the event page when no album exists yet
  if (photos.length === 0) {
    redirect(`/events/${slug}`);
  }

  const resolvedPhotos = photos.map((p) => ({
    src: p.image,
    alt: lang === "fr" ? p.altFr : p.altEn,
  }));

  const formattedDate = new Date(event.date).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const langParam = lang === "en" ? "?lang=en" : "";

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      {/* Breadcrumb */}
      <nav aria-label={lang === "fr" ? "Fil d'Ariane" : "Breadcrumb"} className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href={`/${langParam}`} className="hover:text-foreground transition-colors">
              {t("nav.home")}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link
              href={`/events${langParam}`}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.events")}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link
              href={`/events/${slug}${langParam}`}
              className="hover:text-foreground transition-colors"
            >
              {event.title[lang]}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li aria-current="page" className="text-foreground font-medium">
            {t("album.photos")}
          </li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4 -ml-3">
          <Link href={`/events/${slug}${langParam}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("events.album.backToEvent")}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">{event.title[lang]}</h1>
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>

      {/* Full album grid with lightbox */}
      <AlbumClient
        photos={resolvedPhotos}
        imageOfTemplate={t("gallery.imageOf")}
        viewImageLabel={t("gallery.viewImage")}
        prevLabel={t("common.previous")}
        nextLabel={t("common.next")}
        emptyMessage={t("events.album.noPhotos")}
      />
    </div>
  );
}
