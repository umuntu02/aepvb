"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "@/components/LanguageProvider";
import { getUpcomingEvents, getPastEvents } from "@/lib/constants/mock-data";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export default function EventsPage() {
  const { t, language } = useTranslations();
  const [eventType, setEventType] = useState<"upcoming" | "past">("upcoming");
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  const events = eventType === "upcoming" ? upcoming : past;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("events.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("events.subtitle")}</p>
      </div>

      <Tabs value={eventType} onValueChange={(v) => setEventType(v as "upcoming" | "past")} className="mb-8">
        <TabsList className="mx-auto">
          <TabsTrigger value="upcoming">{t("events.upcoming")}</TabsTrigger>
          <TabsTrigger value="past">{t("events.past")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={event.image}
                  alt={event.title[language]}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">
                  {event.type}
                </Badge>
                <CardTitle>{event.title[language]}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description[language]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.location[language]}</span>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/events/${event.slug}`}>
                    {event.registrationRequired ? t("events.register") : t("common.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            {eventType === "upcoming" 
              ? t("events.upcoming") + " - Aucun événement à venir"
              : t("events.past") + " - Aucun événement passé"}
          </p>
        </div>
      )}
    </div>
  );
}
