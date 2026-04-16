import { getAllNews } from "@/lib/db/queries/news";
import NewsClient from "./NewsClient";

export default async function NewsPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  // DECISION: language selection in NewsClient is via useTranslations()
  // context which syncs from the URL param — no server-side lang needed here.
  const articles = await getAllNews();
  return <NewsClient articles={articles} />;
}
