import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { KeyFigures } from "@/components/sections/KeyFigures";
import { CTA } from "@/components/sections/CTA";
import { Partners } from "@/components/sections/Partners";
import { Members } from "@/components/sections/Members";
import { Tools } from "@/components/sections/Tools";
import { News } from "@/components/sections/News";
import { Testimonials } from "@/components/sections/Testimonials";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { getTranslations, getCurrentLang } from "@/lib/i18n/server";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { generateMetadata, pageMetadata } from "@/lib/metadata";
import { getAllPrograms } from "@/lib/db/queries/programs";
import { getUpcomingEvents } from "@/lib/db/queries/events";
import { getLatestNews } from "@/lib/db/queries/news";
import { getAllTeamMembers } from "@/lib/db/queries/team";
import { getPublishedPartners, getAllPartners } from "@/lib/db/queries/partners";
import { getPublishedSlides, getAllSlides } from "@/lib/db/queries/hero";
import { getPublishedHighlights, getAllHighlights } from "@/lib/db/queries/highlights";
import { getPublishedTestimonials, getAllTestimonials } from "@/lib/db/queries/testimonials";
import { getCTA } from "@/lib/db/queries/cta";
import type { PartnerRow } from "@/lib/db/queries/partners";

export const metadata = generateMetadata({
  ...pageMetadata.home.fr,
  lang: "fr",
  path: "/",
});

// DECISION: preview mode is triggered by ?preview=1 query param OR the
// aepvb_preview_mode cookie. When active, draft content is visible and
// a sticky amber banner is shown. Admins click "Quitter l'aperçu" to exit.
async function isPreviewMode(searchParams: Record<string, string | undefined>): Promise<boolean> {
  if (searchParams.preview === "1") return true;
  const store = await cookies();
  return store.get("aepvb_preview_mode")?.value === "1";
}

function partnerRowToLegacy(row: PartnerRow) {
  return {
    id: String(row.id),
    name: row.name,
    logo: row.logo ?? undefined,
    website: row.website ?? undefined,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; preview?: string }>;
}) {
  const params = await searchParams;
  const lang = getCurrentLang(params);
  const { t } = getTranslations(lang);
  const preview = await isPreviewMode(params);

  const [
    latestNews,
    upcomingEvents,
    allPrograms,
    teamMembersList,
    partnerRows,
    heroSlides,
    highlightRows,
    testimonialRows,
    ctaData,
  ] = await Promise.all([
    getLatestNews(3),
    getUpcomingEvents(3),
    getAllPrograms(),
    getAllTeamMembers(),
    preview ? getAllPartners() : getPublishedPartners(),
    preview ? getAllSlides() : getPublishedSlides(),
    preview ? getAllHighlights() : getPublishedHighlights(),
    preview ? getAllTestimonials() : getPublishedTestimonials(),
    getCTA(),
  ]);

  const featuredPrograms = allPrograms.slice(0, 3);
  const partnersList = partnerRows.map(partnerRowToLegacy);

  // Map DB testimonials to the shape expected by the Testimonials component
  const testimonialProps = testimonialRows.map((r) => ({
    id: String(r.id),
    quote: { fr: r.contentFr, en: r.contentEn },
    author: r.authorName,
    role: { fr: r.authorRoleFr ?? "Témoignage", en: r.authorRoleEn ?? "Testimonial" },
    image: r.authorPhoto ?? "/img/IMG_8674.JPG",
    // DECISION: category badge reuses the role text for recognisability
    category: { fr: r.authorRoleFr ?? "TÉMOIGNAGE", en: r.authorRoleEn ?? "TESTIMONIAL" },
  }));

  const showCta = ctaData && (preview || ctaData.status === "published");

  return (
    <>
      {/* Preview mode sticky banner */}
      {preview && (
        <div
          role="alert"
          aria-live="polite"
          className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-900"
        >
          <span>
            MODE APERÇU — Les brouillons sont visibles. Cette vue n&apos;est pas publique.
          </span>
          <form action="/api/admin/preview" method="POST">
            <button
              type="submit"
              className="rounded bg-amber-900/20 px-3 py-1 text-xs font-semibold hover:bg-amber-900/30 transition-colors"
            >
              Quitter l&apos;aperçu
            </button>
          </form>
        </div>
      )}

      <Hero slides={heroSlides} lang={lang} />
      <Highlights />

      {/* Chiffres clés (DB-backed statistics) */}
      {highlightRows.length > 0 && <KeyFigures figures={highlightRows} />}

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
                {program.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={program.image}
                      alt={program.title[lang]}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {t(`programs.filter.${program.category}`)}
                  </Badge>
                  <CardTitle>{program.title[lang]}</CardTitle>
                  <CardDescription>{program.description[lang]}</CardDescription>
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
      <div id="news">
        <News articles={latestNews} limit={3} />
      </div>

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
                {event.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.image}
                      alt={event.title[lang]}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {event.type}
                  </Badge>
                  <CardTitle>{event.title[lang]}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description[lang]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location[lang]}</span>
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

      {/* Tools Section */}
      <Tools />

      {/* Team Members */}
      <Members members={teamMembersList} limit={6} />

      {/* Donate CTA (DB-backed) */}
      {showCta && (
        <div id="cta">
          <CTA
            title={lang === "en" ? ctaData.titleEn : ctaData.titleFr}
            subtitle={lang === "en" ? (ctaData.subtitleEn ?? "") : (ctaData.subtitleFr ?? "")}
            buttonText={lang === "en" ? ctaData.buttonLabelEn : ctaData.buttonLabelFr}
            buttonHref={ctaData.buttonUrl}
            variant="primary"
          />
        </div>
      )}

      {/* Partners (DB-backed, published only unless preview) */}
      <div id="partners">
        <Partners partners={partnersList} />
      </div>

      {/* Testimonials (DB-backed) */}
      {testimonialProps.length > 0 && (
        <div id="testimonials">
          <Testimonials testimonials={testimonialProps} />
        </div>
      )}
    </>
  );
}
