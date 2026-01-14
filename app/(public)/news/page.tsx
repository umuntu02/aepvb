"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTranslations } from "@/components/LanguageProvider";
import { newsArticles } from "@/lib/constants/mock-data";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Search, ArrowRight } from "lucide-react";

export default function NewsPage() {
  const { t, language } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const categories = Array.from(new Set(newsArticles.map((n) => n.category)));

  const filteredNews = newsArticles
    .filter((article) => {
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content[language].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title[language].localeCompare(b.title[language]);
    });

  return (
    <div className="container mx-auto px-4 ">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("news.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("news.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label={t("common.search")}
          />
        </div>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label={t("common.filter")}
        >
          <option value="all">{t("common.all")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "title")}
          aria-label="Sort by"
        >
          <option value="date">{t("news.onDate")}</option>
          <option value="title">{t("news.title")}</option>
        </Select>
      </div>

      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={article.image}
                alt={article.title[language]}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <Badge variant="outline" className="mb-2 w-fit">
                {article.category}
              </Badge>
              <CardTitle className="line-clamp-2">{article.title[language]}</CardTitle>
              <CardDescription className="line-clamp-3">
                {article.excerpt[language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/news/${article.slug}`}>
                  {t("common.readMore")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
