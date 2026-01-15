import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { CTA } from "@/components/sections/CTA";
import { Partners } from "@/components/sections/Partners";
import { Members } from "@/components/sections/Members";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { getLatestNews, getUpcomingEvents, programs } from "@/lib/constants/mock-data";
import { getTranslations } from "@/lib/i18n/server";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { generateMetadata, pageMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  ...pageMetadata.home.fr,
  lang: "fr",
  path: "/",
});

export default async function HomePage() {
  const { t } = getTranslations("fr");
  const latestNews = getLatestNews(3);
  const upcomingEvents = getUpcomingEvents().slice(0, 3);
  const featuredPrograms = programs.slice(0, 3);

  return (
    <>
      <Hero />
      <Highlights />

      {/* Programs Preview */}
      <section className="py-4 bg-gradient-to-b from-background to-primary/5" aria-label="Programs">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">{t("home.programs.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.programs.subtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={program.image}
                    alt={program.title.fr}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {t(`programs.filter.${program.category}`)}
                  </Badge>
                  <CardTitle>{program.title.fr}</CardTitle>
                  <CardDescription>{program.description.fr}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/programs/${program.slug}`}>
                      {t("common.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/programs">{t("common.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-4 bg-gradient-to-b from-primary/5 via-muted/30 to-secondary/5" aria-label="Latest News">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">{t("home.news.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.news.subtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((news) => (
              <Card key={news.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={news.image}
                    alt={news.title.fr}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <Badge variant="outline" className="mb-2 w-fit">
                    {news.category}
                  </Badge>
                  <CardTitle className="line-clamp-2">{news.title.fr}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {news.excerpt.fr}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(news.date).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/news/${news.slug}`}>
                      {t("common.readMore")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/news">{t("common.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-4 bg-gradient-to-b from-background to-primary/5" aria-label="Upcoming Events">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">{t("home.events.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.events.subtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title.fr}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {event.type}
                  </Badge>
                  <CardTitle>{event.title.fr}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description.fr}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location.fr}</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/events/${event.slug}`}>
                      {t("common.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/events">{t("common.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <Members limit={6} />

      {/* Donate CTA */}
      <CTA
        title={t("home.donate.title")}
        subtitle={t("home.donate.subtitle")}
        buttonText={t("home.donate.button")}
        buttonHref="/donate"
        variant="primary"
      />

      {/* Partners */}
      <Partners />
    </>
  );
}
