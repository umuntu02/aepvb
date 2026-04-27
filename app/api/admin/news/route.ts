import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db.select().from(news).orderBy(desc(news.updatedAt));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();

  if (!body.titleFr || !body.category || !body.author) {
    return Response.json(
      { error: "Champs obligatoires : titleFr, category, author" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(news)
    .values({
      // Legacy required columns — derived from bilingual fields
      title: body.titleFr,
      content: body.contentFr ?? "",
      author: body.author,
      category: body.category,
      slug: body.slug || null,
      titleFr: body.titleFr,
      titleEn: body.titleEn ?? null,
      contentFr: body.contentFr ?? null,
      contentEn: body.contentEn ?? null,
      excerptFr: body.excerptFr ?? null,
      excerptEn: body.excerptEn ?? null,
      image: body.image ?? null,
      date: body.date ?? null,
      featured: body.featured ?? false,
      published: body.published ?? true,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/news");
  if (created.slug) revalidatePath(`/news/${created.slug}`);

  return Response.json(created, { status: 201 });
}
