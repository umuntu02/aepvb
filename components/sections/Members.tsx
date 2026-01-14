"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { teamMembers, type TeamMember } from "@/lib/constants/mock-data";
import { Users, ArrowRight } from "lucide-react";

interface MembersProps {
  limit?: number;
  className?: string;
}

export function Members({ limit = 6, className }: MembersProps) {
  const { t, language } = useTranslations();
  const displayedMembers = teamMembers.slice(0, limit);

  return (
    <section className={`py-4 bg-gradient-to-b from-primary/5 via-muted/30 to-secondary/5 ${className || ""}`} aria-label="Team Members">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold">{t("home.team.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("home.team.subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedMembers.map((member) => (
            <Card key={member.id} className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="font-semibold text-base">
                  {member.role[language]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {member.bio[language]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {teamMembers.length > limit && (
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/about">
                {t("common.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
