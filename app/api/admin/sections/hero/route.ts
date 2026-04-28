import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { createSlide } from "@/lib/db/queries/hero";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db.select().from(heroSlides).orderBy(asc(heroSlides.ordinal), asc(heroSlides.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const body = await request.json();
  if (!body.image || !body.altFr || !body.altEn || !body.titleFr || !body.titleEn) {
    return Response.json({ error: "Champs obligatoires : image, altFr, altEn, titleFr, titleEn" }, { status: 400 });
  }
  const row = await createSlide({
    image: body.image,
    altFr: body.altFr,
    altEn: body.altEn,
    titleFr: body.titleFr,
    titleEn: body.titleEn,
    subtitleFr: body.subtitleFr ?? null,
    subtitleEn: body.subtitleEn ?? null,
    ctaLabelFr: body.ctaLabelFr ?? null,
    ctaLabelEn: body.ctaLabelEn ?? null,
    ctaUrl: body.ctaUrl ?? null,
    ordinal: body.ordinal ?? 0,
    status: body.status ?? "draft",
  });
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(row, { status: 201 });
}
