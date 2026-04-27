import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
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
  if (!body.name || !body.roleFr) {
    return Response.json(
      { error: "Champs obligatoires : name, roleFr" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, numId))
    .limit(1);
  if (!existing) return Response.json({ error: "Introuvable" }, { status: 404 });

  const [updated] = await db
    .update(teamMembers)
    .set({
      name: body.name,
      roleFr: body.roleFr,
      roleEn: body.roleEn ?? body.roleFr,
      bioFr: body.bioFr ?? "",
      bioEn: body.bioEn ?? "",
      photo: body.photo ?? null,
      updatedAt: new Date(),
    })
    .where(eq(teamMembers.id, numId))
    .returning();

  if (!updated) return Response.json({ error: "Introuvable" }, { status: 404 });

  if (existing.photo && existing.photo !== (body.photo ?? null)) {
    await deleteUploadedFile(existing.photo);
  }

  revalidatePath("/about");
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
    .from(teamMembers)
    .where(eq(teamMembers.id, numId))
    .limit(1);
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });

  await db.delete(teamMembers).where(eq(teamMembers.id, numId));
  await deleteUploadedFile(row.photo);

  revalidatePath("/about");
  return Response.json({ ok: true });
}
