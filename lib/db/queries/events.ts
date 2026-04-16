import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq, and, ne, gte, lt, asc, desc, sql } from "drizzle-orm";
import type { Event } from "@/lib/constants/mock-data";

function rowToEvent(row: typeof events.$inferSelect): Event {
  return {
    id: String(row.id),
    slug: row.slug,
    title: { fr: row.titleFr, en: row.titleEn },
    description: { fr: row.descriptionFr, en: row.descriptionEn },
    location: { fr: row.locationFr, en: row.locationEn },
    date: typeof row.date === "string" ? row.date : String(row.date).split("T")[0],
    time: row.time ?? "",
    type: row.type as Event["type"],
    image: row.image ?? "",
    registrationRequired: row.registrationRequired,
  };
}

export async function getAllEvents(): Promise<Event[]> {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(desc(events.date));
  return rows.map(rowToEvent);
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  const query = db
    .select()
    .from(events)
    .where(and(eq(events.published, true), sql`${events.date} >= ${today}::date`))
    .orderBy(asc(events.date));
  const rows = limit ? await query.limit(limit) : await query;
  return rows.map(rowToEvent);
}

export async function getPastEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  const rows = await db
    .select()
    .from(events)
    .where(and(eq(events.published, true), sql`${events.date} < ${today}::date`))
    .orderBy(desc(events.date));
  return rows.map(rowToEvent);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);
  return rows[0] ? rowToEvent(rows[0]) : null;
}

export async function getRelatedEvents(
  type: string,
  excludeSlug: string,
  limit = 3
): Promise<Event[]> {
  const rows = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.published, true),
        eq(events.type, type),
        ne(events.slug, excludeSlug)
      )
    )
    .orderBy(desc(events.date))
    .limit(limit);
  return rows.map(rowToEvent);
}
