import { db } from "@/lib/db";
import { programs } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db.select().from(programs).orderBy(asc(programs.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();
  if (!body.titleFr || !body.slug || !body.category) {
    return Response.json(
      { error: "Champs obligatoires : titleFr, slug, category" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(programs)
    .values({
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
    })
    .returning();

  revalidatePath("/programs");
  revalidatePath(`/programs/${created.slug}`);

  return Response.json(created, { status: 201 });
}
