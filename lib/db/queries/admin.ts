import { db } from "@/lib/db";
import { news, programs, events, gallery, teamMembers, partners } from "@/lib/db/schema";
import { count, desc, eq, gte, lt, sql } from "drizzle-orm";

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
