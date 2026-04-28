import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEventBySlug, getRelatedEvents } from "@/lib/db/queries/events";
import { getPhotosByEventId } from "@/lib/db/queries/albums";
import { getTranslations, getCurrentLang } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { generateMetadata as genMeta } from "@/lib/metadata";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return genMeta({
      title: "Événement introuvable",
      description: "L'événement demandé n'a pas été trouvé",
      lang: "fr",
      path: `/events/${slug}`,
    });
  }

  const lang = getCurrentLang(await searchParams);
  return genMeta({
    title: event.title[lang],
    description: event.description[lang],
    lang,
    path: `/events/${slug}`,
  });
}

export default async function EventDetailPage({ params, searchParams }: EventDetailPageProps) {
  const { slug } = await params;
  const lang = getCurrentLang(await searchParams);
  const { t } = getTranslations(lang);

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const [relatedEvents, allPhotos] = await Promise.all([
    getRelatedEvents(event.type, slug, 3),
    getPhotosByEventId(parseInt(event.id)),
  ]);

  const isPast = new Date(event.date) < new Date();
  const previewPhotos = allPhotos.slice(0, 5);
  const totalPhotos = allPhotos.length;

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
        </Link>
      </Button>

      <article>
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {event.type}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold">{event.title[lang]}</h1>
        </div>

        {event.image && (
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={event.image}
              alt={event.title[lang]}
              fill
              className="object-cover"
            />
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{lang === "fr" ? "Détails de l'événement" : "Event Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("events.date")}</p>
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("events.time")}</p>
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("events.location")}</p>
                  <p className="text-muted-foreground">{event.location[lang]}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">{event.description[lang]}</p>
        </div>

        {event.registrationRequired && !isPast && (
          <div className="mb-12">
            <Button size="lg" className="w-full md:w-auto">
              {t("events.register")}
            </Button>
          </div>
        )}

        {/* Album preview strip — only rendered when photos exist */}
        {previewPhotos.length > 0 && (
          <section className="mb-12" aria-label={t("events.album.title")}>
            <h2 className="text-2xl font-bold mb-6">{t("events.album.title")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {previewPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={photo.image}
                    alt={lang === "fr" ? photo.altFr : photo.altEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              ))}
            </div>
            <Button asChild variant="outline">
              <Link href={`/events/${slug}/photos`}>
                {t("events.album.viewFull", { count: String(totalPhotos) })}
              </Link>
            </Button>
          </section>
        )}

        <Separator className="my-12" />

        {relatedEvents.length > 0 && (
          <section className="mt-16" aria-label="Related Events">
            <h2 className="mb-8 text-2xl font-bold">{t("events.detail.related")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedEvents.map((related) => (
                <Card key={related.id} className="overflow-hidden">
                  {related.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={related.image}
                        alt={related.title[lang]}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{related.title[lang]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/events/${related.slug}`}>
                        {t("common.learnMore")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
