import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { desc } from "drizzle-orm";

async function getNews() {
  try {
    const allNews = await db.select().from(news).orderBy(desc(news.createdAt));
    console.log("Fetched news items:", allNews.length);
    return allNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}

export default async function Home() {
  const newsItems = await getNews();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Organization News & Events
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Stay updated with our latest announcements and upcoming events
          </p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No news items found. Run the seed script to populate the database.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl leading-tight">
                      {item.title}
                    </CardTitle>
                    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {item.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 line-clamp-3">
                    {item.content}
                  </CardDescription>
                  <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
