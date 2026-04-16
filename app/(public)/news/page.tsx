import { getAllNews } from "@/lib/db/queries/news";
import NewsClient from "./NewsClient";

export default async function NewsPage() {
  const articles = await getAllNews();
  return <NewsClient articles={articles} />;
}
