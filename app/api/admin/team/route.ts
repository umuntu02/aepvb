import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.ordinal), asc(teamMembers.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();
  if (!body.name || !body.roleFr) {
    return Response.json(
      { error: "Champs obligatoires : name, roleFr" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(teamMembers)
    .values({
      name: body.name,
      roleFr: body.roleFr,
      roleEn: body.roleEn ?? body.roleFr,
      bioFr: body.bioFr ?? "",
      bioEn: body.bioEn ?? "",
      photo: body.photo ?? null,
      ordinal: body.ordinal ?? 0,
    })
    .returning();

  revalidatePath("/about");
  return Response.json(created, { status: 201 });
}
