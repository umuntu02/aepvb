import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProgramBySlug, programs } from "@/lib/constants/mock-data";
import { getTranslations } from "@/lib/i18n/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface ProgramDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  const { t } = getTranslations("fr");

  if (!program) {
    notFound();
  }

  // Get related programs (same category, different program)
  const relatedPrograms = programs
    .filter((p) => p.category === program.category && p.id !== program.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 ">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/programs">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
        </Link>
      </Button>

      <article>
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {t(`programs.filter.${program.category}`)}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold">{program.title.fr}</h1>
        </div>

        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={program.image}
            alt={program.title.fr}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">{program.fullDescription.fr}</p>
        </div>

        {relatedPrograms.length > 0 && (
          <section className="mt-16" aria-label="Related Programs">
            <h2 className="mb-8 text-2xl font-bold">{t("programs.detail.related")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPrograms.map((related) => (
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
                      <Link href={`/programs/${related.slug}`}>
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
