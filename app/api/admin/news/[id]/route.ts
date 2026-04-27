import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { deleteUploadedFile } from "@/lib/upload";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) return Response.json({ error: "ID invalide" }, { status: 400 });

  const body = await request.json();
  if (!body.titleFr || !body.category || !body.author) {
    return Response.json(
      { error: "Champs obligatoires : titleFr, category, author" },
      { status: 400 }
    );
  }

  const [existing] = await db.select().from(news).where(eq(news.id, numId)).limit(1);
  if (!existing) return Response.json({ error: "Introuvable" }, { status: 404 });

  const [updated] = await db
    .update(news)
    .set({
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
      updatedAt: new Date(),
    })
    .where(eq(news.id, numId))
    .returning();

  if (!updated) return Response.json({ error: "Introuvable" }, { status: 404 });

  // Delete old image file only if it changed and was from the upload store.
  if (existing.image && existing.image !== (body.image ?? null)) {
    await deleteUploadedFile(existing.image);
  }

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/news/[slug]", "page");

  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) return Response.json({ error: "ID invalide" }, { status: 400 });

  const [row] = await db.select().from(news).where(eq(news.id, numId)).limit(1);
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });

  await db.delete(news).where(eq(news.id, numId));
  await deleteUploadedFile(row.image);

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/news/[slug]", "page");

  return Response.json({ ok: true });
}
