"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "@/components/LanguageProvider";
import { programs, type ProgramCategory } from "@/lib/constants/mock-data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";

export default function ProgramsPage() {
  const { t, language } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory | "all">("all");

  const categories: Array<{ value: ProgramCategory | "all"; label: string }> = [
    { value: "all", label: t("programs.filter.all") },
    { value: "education", label: t("programs.filter.education") },
    { value: "health", label: t("programs.filter.health") },
    { value: "economic", label: t("programs.filter.economic") },
    { value: "environment", label: t("programs.filter.environment") },
    { value: "peace", label: t("programs.filter.peace") },
  ];

  const filteredPrograms = programs.filter((program) => {
    const matchesCategory =
      selectedCategory === "all" || program.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      program.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("programs.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("programs.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
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
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ProgramCategory | "all")}>
          <TabsList className="flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={program.image}
                  alt={program.title[language]}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">
                  {t(`programs.filter.${program.category}`)}
                </Badge>
                <CardTitle>{program.title[language]}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {program.description[language]}
                </CardDescription>
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
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">{t("programs.noResults")}</p>
        </div>
      )}
    </div>
  );
}
