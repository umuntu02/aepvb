"use client";

import { useTranslations } from "@/components/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { teamMembers, type TeamMember } from "@/lib/constants/mock-data";
import { Users, ArrowRight, UserCircle, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembersProps {
  limit?: number;
  className?: string;
}

export function Members({ limit = 6, className }: MembersProps) {
  const { t, language } = useTranslations();
  const displayedMembers = teamMembers.slice(0, limit);

  return (
    <section
      className={cn(
        "py-4 md:py-4 lg:py-20 bg-gradient-to-b from-primary/5 via-muted/30 to-secondary/5",
        className
      )}
      aria-label={t("home.team.title")}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-md transition-transform duration-300 hover:scale-110">
              <Users className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("home.team.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {t("home.team.subtitle")}
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {displayedMembers.map((member, index) => (
            <Card
              key={member.id}
              className={cn(
                "group relative overflow-hidden border-2 border-border bg-card transition-all duration-300",
                "hover:border-primary hover:shadow-xl hover:scale-[1.02]",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              )}
            >
              {/* Decorative Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <CardHeader className="pb-4">
                {/* Member Icon/Avatar */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                    <UserCircle className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-md font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary ">
                      {member.name}
                    </CardTitle>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                  <CardDescription className="text-sm font-semibold text-primary">
                    {member.role[language]}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed text-center text-muted-foreground">
                  {member.bio[language]}
                </p>
              </CardContent>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {teamMembers.length > limit && (
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group border-2 border-primary text-primary shadow-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Link href="/about">
                {t("common.viewAll")}{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
