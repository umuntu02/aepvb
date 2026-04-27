import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
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
  if (!body.name) {
    return Response.json({ error: "Champ obligatoire : name" }, { status: 400 });
  }

  if (body.website && !/^https?:\/\//i.test(body.website)) {
    return Response.json(
      { error: "L'URL doit commencer par https:// ou http://" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(partners)
    .where(eq(partners.id, numId))
    .limit(1);
  if (!existing) return Response.json({ error: "Introuvable" }, { status: 404 });

  const [updated] = await db
    .update(partners)
    .set({
      name: body.name,
      logo: body.logo ?? null,
      website: body.website ?? null,
      updatedAt: new Date(),
    })
    .where(eq(partners.id, numId))
    .returning();

  if (!updated) return Response.json({ error: "Introuvable" }, { status: 404 });

  if (existing.logo && existing.logo !== (body.logo ?? null)) {
    await deleteUploadedFile(existing.logo);
  }

  revalidatePath("/");
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

  const [row] = await db
    .select()
    .from(partners)
    .where(eq(partners.id, numId))
    .limit(1);
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });

  await db.delete(partners).where(eq(partners.id, numId));
  await deleteUploadedFile(row.logo);

  revalidatePath("/");
  return Response.json({ ok: true });
}
