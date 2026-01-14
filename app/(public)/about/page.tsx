import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "@/lib/i18n/server";
import { teamMembers } from "@/lib/constants/mock-data";
import { Heart, Eye, Scale, Users } from "lucide-react";

export default async function AboutPage() {
  const { t } = getTranslations("fr");

  const values = [
    {
      icon: Users,
      title: t("about.values.inclusion"),
      description: t("about.values.inclusionDesc"),
    },
    {
      icon: Scale,
      title: t("about.values.dignity"),
      description: t("about.values.dignityDesc"),
    },
    {
      icon: Heart,
      title: t("about.values.equality"),
      description: t("about.values.equalityDesc"),
    },
    {
      icon: Users,
      title: t("about.values.community"),
      description: t("about.values.communityDesc"),
    },
  ];

  return (
    <div className="container mx-auto px-4 ">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("about.title")}</h1>
      </div>

      {/* Mission */}
      <section className="mb-16" aria-label="Mission">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">{t("about.mission.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{t("about.mission.content")}</p>
          </CardContent>
        </Card>
      </section>

      {/* Vision */}
      <section className="mb-16" aria-label="Vision">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">{t("about.vision.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic">"{t("about.vision.content")}"</p>
          </CardContent>
        </Card>
      </section>

      {/* Values */}
      <section className="mb-16" aria-label="Values">
        <h2 className="mb-8 text-center text-3xl font-bold">{t("about.values.title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator className="my-16" />

      {/* Structure */}
      <section className="mb-16" aria-label="Organizational Structure">
        <h2 className="mb-8 text-center text-3xl font-bold">
          {t("about.structure.title")}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg">{t("about.structure.content")}</p>
          </CardContent>
        </Card>
      </section>

      {/* Team */}
      <section aria-label="Team">
        <h2 className="mb-8 text-center text-3xl font-bold">{t("about.team.title")}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id} className="border-2">
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription className="font-semibold">
                  {member.role.fr}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.bio.fr}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
