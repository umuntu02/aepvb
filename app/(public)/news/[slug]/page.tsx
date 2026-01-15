import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getNewsBySlug, newsArticles } from "@/lib/constants/mock-data";
import { getTranslations } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { generateMetadata as genMeta } from "@/lib/metadata";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  
  if (!article) {
    return genMeta({
      title: "Article introuvable",
      description: "L'article demandé n'a pas été trouvé",
      lang: "fr",
      path: `/news/${slug}`,
    });
  }

  return genMeta({
    title: article.title.fr,
    description: article.excerpt.fr,
    lang: "fr",
    path: `/news/${slug}`,
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  const { t } = getTranslations("fr");

  if (!article) {
    notFound();
  }

  // Get related articles (same category, different article)
  const relatedArticles = newsArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/news">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
        </Link>
      </Button>

      <article>
        <div className="mb-8">
          <Badge variant="outline" className="mb-4">
            {article.category}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold">{article.title.fr}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
          </div>
        </div>

        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={article.image}
            alt={article.title.fr}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed whitespace-pre-line">{article.content.fr}</p>
        </div>

        <Separator className="my-12" />

        {relatedArticles.length > 0 && (
          <section className="mt-16" aria-label="Related Articles">
            <h2 className="mb-8 text-2xl font-bold">{t("news.detail.related")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((related) => (
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
                      <Link href={`/news/${related.slug}`}>
                        {t("common.readMore")}
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
