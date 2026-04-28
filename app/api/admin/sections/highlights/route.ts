import { db } from "@/lib/db";
import { highlights } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { createHighlight } from "@/lib/db/queries/highlights";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db.select().from(highlights).orderBy(asc(highlights.ordinal), asc(highlights.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const body = await request.json();
  if (!body.valueFr || !body.valueEn || !body.labelFr || !body.labelEn) {
    return Response.json({ error: "Champs obligatoires : valueFr, valueEn, labelFr, labelEn" }, { status: 400 });
  }
  const row = await createHighlight({
    icon: body.icon ?? null,
    valueFr: body.valueFr,
    valueEn: body.valueEn,
    labelFr: body.labelFr,
    labelEn: body.labelEn,
    ordinal: body.ordinal ?? 0,
    status: body.status ?? "draft",
  });
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(row, { status: 201 });
}
