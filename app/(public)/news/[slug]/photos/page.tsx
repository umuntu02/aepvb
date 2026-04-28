import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getNewsArticleBySlug } from "@/lib/db/queries/news";
import { getPhotosByNewsId } from "@/lib/db/queries/albums";
import { getTranslations, getCurrentLang } from "@/lib/i18n/server";
import { AlbumClient } from "@/components/AlbumClient";
import { generateMetadata as genMeta } from "@/lib/metadata";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface NewsPhotosPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: NewsPhotosPageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) {
    return genMeta({
      title: "Album introuvable",
      description: "",
      lang: "fr",
      path: `/news/${slug}/photos`,
    });
  }
  const lang = getCurrentLang(await searchParams);
  return genMeta({
    title: `${article.title[lang]} — Photos`,
    description: article.excerpt[lang],
    lang,
    path: `/news/${slug}/photos`,
  });
}

export default async function NewsPhotosPage({
  params,
  searchParams,
}: NewsPhotosPageProps) {
  const { slug } = await params;
  const lang = getCurrentLang(await searchParams);
  const { t } = getTranslations(lang);

  const article = await getNewsArticleBySlug(slug);
  if (!article) notFound();

  const photos = await getPhotosByNewsId(parseInt(article.id));

  // Redirect to the article when no album exists yet
  if (photos.length === 0) {
    redirect(`/news/${slug}`);
  }

  const resolvedPhotos = photos.map((p) => ({
    src: p.image,
    alt: lang === "fr" ? p.altFr : p.altEn,
  }));

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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
              href={`/news${langParam}`}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.news")}
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link
              href={`/news/${slug}${langParam}`}
              className="hover:text-foreground transition-colors"
            >
              {article.title[lang]}
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
          <Link href={`/news/${slug}${langParam}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("news.album.backToNews")}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">{article.title[lang]}</h1>
        {formattedDate && (
          <p className="text-muted-foreground">{formattedDate}</p>
        )}
      </div>

      {/* Full album grid with lightbox */}
      <AlbumClient
        photos={resolvedPhotos}
        imageOfTemplate={t("gallery.imageOf")}
        viewImageLabel={t("gallery.viewImage")}
        prevLabel={t("common.previous")}
        nextLabel={t("common.next")}
        emptyMessage={t("news.album.noPhotos")}
      />
    </div>
  );
}
