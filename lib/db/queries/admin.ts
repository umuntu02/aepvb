import { db } from "@/lib/db";
import { news, programs, events, gallery, teamMembers, partners,
         heroSlides, highlights, testimonials } from "@/lib/db/schema";
import { count, desc, eq, gte, lt, sql, and } from "drizzle-orm";

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0];

  const [
    [newsCount],
    [upcomingCount],
    [pastCount],
    [galleryCount],
    [programsCount],
  ] = await Promise.all([
    db.select({ count: count() }).from(news),
    db
      .select({ count: count() })
      .from(events)
      .where(sql`${events.date} >= ${today}::date`),
    db
      .select({ count: count() })
      .from(events)
      .where(sql`${events.date} < ${today}::date`),
    db.select({ count: count() }).from(gallery),
    db.select({ count: count() }).from(programs),
  ]);

  return {
    news: newsCount.count,
    eventsUpcoming: upcomingCount.count,
    eventsPast: pastCount.count,
    gallery: galleryCount.count,
    programs: programsCount.count,
  };
}

export interface ContentSummary {
  hero: { total: number; published: number; draft: number };
  highlights: { total: number; published: number; draft: number };
  testimonials: { total: number; published: number; draft: number };
  partners: { total: number; published: number; draft: number };
  news: { total: number; published: number; draft: number };
  events: { total: number; upcoming: number; past: number };
  gallery: { total: number };
  programs: { total: number; published: number };
}

export async function getContentSummary(): Promise<ContentSummary> {
  const today = new Date().toISOString().split("T")[0];

  const [
    [heroTotal], [heroPub],
    [hlTotal], [hlPub],
    [testTotal], [testPub],
    [partTotal], [partPub],
    [newsTotal], [newsPub],
    [evtUpcoming], [evtPast],
    [galTotal],
    [progTotal], [progPub],
  ] = await Promise.all([
    db.select({ count: count() }).from(heroSlides),
    db.select({ count: count() }).from(heroSlides).where(eq(heroSlides.status, "published")),
    db.select({ count: count() }).from(highlights),
    db.select({ count: count() }).from(highlights).where(eq(highlights.status, "published")),
    db.select({ count: count() }).from(testimonials),
    db.select({ count: count() }).from(testimonials).where(eq(testimonials.status, "published")),
    db.select({ count: count() }).from(partners),
    db.select({ count: count() }).from(partners).where(eq(partners.status, "published")),
    db.select({ count: count() }).from(news),
    db.select({ count: count() }).from(news).where(eq(news.published, true)),
    db.select({ count: count() }).from(events).where(sql`${events.date} >= ${today}::date`),
    db.select({ count: count() }).from(events).where(sql`${events.date} < ${today}::date`),
    db.select({ count: count() }).from(gallery),
    db.select({ count: count() }).from(programs),
    db.select({ count: count() }).from(programs).where(eq(programs.published, true)),
  ]);

  const n = (r: { count: number }) => Number(r.count);

  return {
    hero: { total: n(heroTotal), published: n(heroPub), draft: n(heroTotal) - n(heroPub) },
    highlights: { total: n(hlTotal), published: n(hlPub), draft: n(hlTotal) - n(hlPub) },
    testimonials: { total: n(testTotal), published: n(testPub), draft: n(testTotal) - n(testPub) },
    partners: { total: n(partTotal), published: n(partPub), draft: n(partTotal) - n(partPub) },
    news: { total: n(newsTotal), published: n(newsPub), draft: n(newsTotal) - n(newsPub) },
    events: { total: n(evtUpcoming) + n(evtPast), upcoming: n(evtUpcoming), past: n(evtPast) },
    gallery: { total: n(galTotal) },
    programs: { total: n(progTotal), published: n(progPub) },
  };
}

type ActivityType = "news" | "events" | "gallery" | "programs";

export interface RecentActivityItem {
  id: number;
  title: string;
  type: ActivityType;
  updatedAt: Date;
  href: string;
}

export async function getRecentActivity(limit = 5): Promise<RecentActivityItem[]> {
  const [recentNews, recentEvents, recentGallery, recentPrograms] =
    await Promise.all([
      db
        .select({ id: news.id, title: news.titleFr, updatedAt: news.updatedAt })
        .from(news)
        .orderBy(desc(news.updatedAt))
        .limit(limit),
      db
        .select({ id: events.id, title: events.titleFr, updatedAt: events.updatedAt })
        .from(events)
        .orderBy(desc(events.updatedAt))
        .limit(limit),
      db
        .select({ id: gallery.id, title: gallery.altFr, updatedAt: gallery.updatedAt })
        .from(gallery)
        .orderBy(desc(gallery.updatedAt))
        .limit(limit),
      db
        .select({ id: programs.id, title: programs.titleFr, updatedAt: programs.updatedAt })
        .from(programs)
        .orderBy(desc(programs.updatedAt))
        .limit(limit),
    ]);

  const combined: RecentActivityItem[] = [
    ...recentNews.map((r) => ({
      id: r.id,
      title: r.title ?? "(sans titre)",
      type: "news" as ActivityType,
      updatedAt: r.updatedAt,
      href: `/admin/news/${r.id}`,
    })),
    ...recentEvents.map((r) => ({
      id: r.id,
      title: r.title,
      type: "events" as ActivityType,
      updatedAt: r.updatedAt,
      href: `/admin/events/${r.id}`,
    })),
    ...recentGallery.map((r) => ({
      id: r.id,
      title: r.title,
      type: "gallery" as ActivityType,
      updatedAt: r.updatedAt,
      href: `/admin/gallery/${r.id}`,
    })),
    ...recentPrograms.map((r) => ({
      id: r.id,
      title: r.title,
      type: "programs" as ActivityType,
      updatedAt: r.updatedAt,
      href: `/admin/programs/${r.id}`,
    })),
  ];

  return combined
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}
