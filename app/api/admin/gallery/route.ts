import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.ordinal), asc(gallery.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();

  if (!body.src || !body.altFr || !body.altEn) {
    return Response.json(
      { error: "Champs obligatoires : src, altFr, altEn" },
      { status: 400 }
    );
  }

  const [maxOrdinal] = await db
    .select({ ordinal: gallery.ordinal })
    .from(gallery)
    .orderBy(desc(gallery.ordinal))
    .limit(1);
  const nextOrdinal = (maxOrdinal?.ordinal ?? -1) + 1;

  const [created] = await db
    .insert(gallery)
    .values({
      src: body.src,
      altFr: body.altFr,
      altEn: body.altEn,
      category: body.category ?? null,
      date: body.date ?? null,
      ordinal: nextOrdinal,
    })
    .returning();

  revalidatePath("/gallery");

  return Response.json(created, { status: 201 });
}
