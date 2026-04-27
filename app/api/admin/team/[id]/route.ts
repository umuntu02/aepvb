import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
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
  if (!body.name || !body.roleFr) {
    return Response.json(
      { error: "Champs obligatoires : name, roleFr" },
      { status: 400 }
    );
  }

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

  if (row.photo) {
    await unlink(join(process.cwd(), "public", row.photo)).catch(() => {});
  }

  revalidatePath("/about");
  return Response.json({ ok: true });
}
