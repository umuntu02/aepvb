import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db.select().from(events).orderBy(desc(events.date));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();

  if (!body.titleFr || !body.slug || !body.date || !body.type) {
    return Response.json(
      { error: "Champs obligatoires : titleFr, slug, date, type" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(events)
    .values({
      slug: body.slug,
      titleFr: body.titleFr,
      titleEn: body.titleEn ?? body.titleFr,
      descriptionFr: body.descriptionFr ?? "",
      descriptionEn: body.descriptionEn ?? "",
      locationFr: body.locationFr ?? "",
      locationEn: body.locationEn ?? "",
      date: body.date,
      time: body.time ?? null,
      type: body.type,
      image: body.image ?? null,
      registrationRequired: body.registrationRequired ?? false,
      published: body.published ?? true,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${created.slug}`);

  return Response.json(created, { status: 201 });
}
