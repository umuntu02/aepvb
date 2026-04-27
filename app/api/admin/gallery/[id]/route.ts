import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
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
  if (!body.src || !body.altFr || !body.altEn) {
    return Response.json(
      { error: "Champs obligatoires : src, altFr, altEn" },
      { status: 400 }
    );
  }

  const [existing] = await db.select().from(gallery).where(eq(gallery.id, numId)).limit(1);
  if (!existing) return Response.json({ error: "Introuvable" }, { status: 404 });

  const [updated] = await db
    .update(gallery)
    .set({
      src: body.src,
      altFr: body.altFr,
      altEn: body.altEn,
      category: body.category ?? null,
      date: body.date ?? null,
      updatedAt: new Date(),
    })
    .where(eq(gallery.id, numId))
    .returning();

  if (!updated) return Response.json({ error: "Introuvable" }, { status: 404 });

  if (existing.src && existing.src !== body.src) {
    await deleteUploadedFile(existing.src);
  }

  revalidatePath("/gallery");
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

  const [row] = await db.select().from(gallery).where(eq(gallery.id, numId)).limit(1);
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });

  await db.delete(gallery).where(eq(gallery.id, numId));
  await deleteUploadedFile(row.src);

  revalidatePath("/gallery");
  return Response.json({ ok: true });
}
