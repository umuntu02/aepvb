import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { news, type News } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export default async function Home() {
  let allNews: News[] = [];
  try {
    allNews = await db.select().from(news).orderBy(desc(news.createdAt));
  } catch (error) {
    console.error('Error fetching news:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Organization Event News</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest events and announcements
          </p>
        </div>

        {allNews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No news available. Run the seed script to add sample data.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allNews.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>
                    {item.organization} • {item.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                    {item.content}
                  </p>
                  {item.eventDate && (
                    <p className="text-xs text-muted-foreground">
                      Event Date:{' '}
                      {new Date(item.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Published:{' '}
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
