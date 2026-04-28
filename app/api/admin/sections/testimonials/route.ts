import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { createTestimonial } from "@/lib/db/queries/testimonials";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.ordinal), asc(testimonials.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const body = await request.json();
  if (!body.authorName || !body.contentFr || !body.contentEn) {
    return Response.json({ error: "Champs obligatoires : authorName, contentFr, contentEn" }, { status: 400 });
  }
  const row = await createTestimonial({
    authorName: body.authorName,
    authorRoleFr: body.authorRoleFr ?? null,
    authorRoleEn: body.authorRoleEn ?? null,
    authorPhoto: body.authorPhoto ?? null,
    contentFr: body.contentFr,
    contentEn: body.contentEn,
    ordinal: body.ordinal ?? 0,
    status: body.status ?? "draft",
  });
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(row, { status: 201 });
}
