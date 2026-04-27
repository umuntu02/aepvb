import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import { join } from "path";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) return Response.json({ error: "ID invalide" }, { status: 400 });

  const body = await request.json();
  if (!body.titleFr || !body.slug || !body.category) {
    return Response.json(
      { error: "Champs obligatoires : titleFr, slug, category" },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(programs)
    .set({
      slug: body.slug,
      titleFr: body.titleFr,
      titleEn: body.titleEn ?? body.titleFr,
      descriptionFr: body.descriptionFr ?? "",
      descriptionEn: body.descriptionEn ?? "",
      fullDescriptionFr: body.fullDescriptionFr ?? "",
      fullDescriptionEn: body.fullDescriptionEn ?? "",
      category: body.category,
      image: body.image ?? "",
      startDate: body.startDate ?? null,
      status: body.status ?? "active",
      published: body.published ?? true,
      updatedAt: new Date(),
    })
    .where(eq(programs.id, numId))
    .returning();

  if (!updated) return Response.json({ error: "Introuvable" }, { status: 404 });

  revalidatePath("/programs");
  revalidatePath("/programs/[slug]", "page");

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

  const [row] = await db.select().from(programs).where(eq(programs.id, numId)).limit(1);
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });

  await db.delete(programs).where(eq(programs.id, numId));

  if (row.image) {
    await unlink(join(process.cwd(), "public", row.image)).catch(() => {});
  }

  revalidatePath("/programs");
  revalidatePath("/programs/[slug]", "page");

  return Response.json({ ok: true });
}
