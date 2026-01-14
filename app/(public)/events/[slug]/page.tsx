import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEventBySlug, events } from "@/lib/constants/mock-data";
import { getTranslations } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  const { t } = getTranslations("fr");

  if (!event) {
    notFound();
  }

  // Get related events (same type, different event)
  const relatedEvents = events
    .filter((e) => e.type === event.type && e.id !== event.id)
    .slice(0, 3);

  const isPast = new Date(event.date) < new Date();

  return (
    <div className="container mx-auto px-4  max-w-4xl">
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
          <h1 className="mb-4 text-4xl font-bold">{event.title.fr}</h1>
        </div>

        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={event.image}
            alt={event.title.fr}
            fill
            className="object-cover"
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détails de l'événement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">{t("events.date")}</p>
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("fr-FR", {
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
                  <p className="text-muted-foreground">{event.location.fr}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">{event.description.fr}</p>
        </div>

        {event.registrationRequired && !isPast && (
          <div className="mb-12">
            <Button size="lg" className="w-full md:w-auto">
              {t("events.register")}
            </Button>
          </div>
        )}

        <Separator className="my-12" />

        {relatedEvents.length > 0 && (
          <section className="mt-16" aria-label="Related Events">
            <h2 className="mb-8 text-2xl font-bold">{t("events.detail.related")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedEvents.map((related) => (
                <Card key={related.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={related.image}
                      alt={related.title.fr}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{related.title.fr}</CardTitle>
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
