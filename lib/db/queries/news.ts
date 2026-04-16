import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { eq, and, ne, desc, isNotNull } from "drizzle-orm";
import type { NewsArticle } from "@/lib/constants/mock-data";

function rowToNewsArticle(row: typeof news.$inferSelect): NewsArticle {
  return {
    id: String(row.id),
    slug: row.slug ?? "",
    title: { fr: row.titleFr ?? row.title, en: row.titleEn ?? row.title },
    content: { fr: row.contentFr ?? row.content, en: row.contentEn ?? row.content },
    excerpt: { fr: row.excerptFr ?? "", en: row.excerptEn ?? "" },
    author: row.author,
    category: row.category,
    image: row.image ?? "",
    date: row.date
      ? typeof row.date === "string"
        ? row.date
        : String(row.date).split("T")[0]
      : "",
    featured: row.featured ?? false,
  };
}

export async function getAllNews(): Promise<NewsArticle[]> {
  const rows = await db
    .select()
    .from(news)
    .where(and(eq(news.published, true), isNotNull(news.slug)))
    .orderBy(desc(news.date));
  return rows.map(rowToNewsArticle);
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const rows = await db
    .select()
    .from(news)
    .where(eq(news.slug, slug))
    .limit(1);
  return rows[0] ? rowToNewsArticle(rows[0]) : null;
}

export async function getFeaturedNews(limit = 3): Promise<NewsArticle[]> {
  const rows = await db
    .select()
    .from(news)
    .where(
      and(
        eq(news.published, true),
        eq(news.featured, true),
        isNotNull(news.slug)
      )
    )
    .orderBy(desc(news.date))
    .limit(limit);
  return rows.map(rowToNewsArticle);
}

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  const rows = await db
    .select()
    .from(news)
    .where(and(eq(news.published, true), isNotNull(news.slug)))
    .orderBy(desc(news.date))
    .limit(limit);
  return rows.map(rowToNewsArticle);
}

export async function getRelatedNews(
  category: string,
  excludeSlug: string,
  limit = 3
): Promise<NewsArticle[]> {
  const rows = await db
    .select()
    .from(news)
    .where(
      and(
        eq(news.published, true),
        eq(news.category, category),
        ne(news.slug, excludeSlug),
        isNotNull(news.slug)
      )
    )
    .orderBy(desc(news.date))
    .limit(limit);
  return rows.map(rowToNewsArticle);
}
