"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { type NewsArticle } from "@/lib/constants/mock-data";
import { cn } from "@/lib/utils";

interface NewsProps {
  articles: NewsArticle[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  limit?: number;
  className?: string;
}

export function News({
  articles,
  title,
  subtitle,
  viewAllHref = "/news",
  limit,
  className,
}: NewsProps) {
  const { t, language } = useTranslations();
  const displayedArticles = limit ? articles.slice(0, limit) : articles;

  const displayTitle = title || t("home.news.title");
  const displaySubtitle = subtitle || t("home.news.subtitle");

  return (
    <section
      className={cn(
        "py-4 bg-gradient-to-b from-primary/5 via-muted/30 to-secondary/5",
        className
      )}
      aria-label={displayTitle}
    >
      <div className="container mx-auto px-4">
        {/* Large Uppercase Title with Wide Spacing */}
        <div className="mb-6 text-center">
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-wider text-primary">
            {displayTitle}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>

        {/* Two-Column Grid Layout for News Articles */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10 mb-12">
          {displayedArticles.map((news) => (
            <Card
              key={news.id}
              className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border-0 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 py-[-20px] pb-6"
            >
              {/* Article Header Bar with "ARTICLE" Label */}
              <div className="bg-[#6ccb6b] text-white px-6 py-3 flex items-center gap-2 shadow-md">
                <FileText className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Article
                </span>
              </div>

              {/* Article Content: Image + Text in Flex Layout */}
              <div className="flex flex-col md:flex-row">
                {/* Image Section - Left Side */}
                <div className="relative w-full md:w-[40%] h-64 md:h-auto min-h-[250px] flex-shrink-0 overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title[language] || news.title.fr}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  {/* Category Badge Overlaying Image */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge
                      variant="secondary"
                      className="bg-black/80 text-white backdrop-blur-sm hover:bg-black/90 px-3 py-1.5 text-xs font-medium shadow-lg transition-colors duration-200"
                    >
                      {news.category}
                    </Badge>
                  </div>
                </div>

                {/* Text Content - Right Side */}
                <div className="flex-1 flex flex-col p-6 md:p-8">
                  <CardTitle className="text-xl md:text-2xl font-bold mb-4 line-clamp-2 leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                    {news.title[language] || news.title.fr}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mb-6 line-clamp-3 flex-1 text-base leading-relaxed">
                    {news.excerpt[language] || news.excerpt.fr}
                  </CardDescription>

                  {/* Date and Read More */}
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <time dateTime={news.date}>
                        {new Date(news.date).toLocaleDateString(
                          language === "fr" ? "fr-FR" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <Link href={`/news/${news.slug}`}>
                        {t("common.readMore")}{" "}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call-to-Action Button */}
        {(!limit || articles.length > limit) && (
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href={viewAllHref}>
                {t("common.viewAll")} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
