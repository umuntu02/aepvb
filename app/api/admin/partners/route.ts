import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const rows = await db
    .select()
    .from(partners)
    .orderBy(asc(partners.ordinal), asc(partners.id));
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();
  if (!body.name) {
    return Response.json({ error: "Champ obligatoire : name" }, { status: 400 });
  }

  if (body.website && !/^https?:\/\//i.test(body.website)) {
    return Response.json({ error: adminFr_urlInvalid }, { status: 400 });
  }

  const [created] = await db
    .insert(partners)
    .values({
      name: body.name,
      logo: body.logo ?? null,
      website: body.website ?? null,
      ordinal: body.ordinal ?? 0,
    })
    .returning();

  revalidatePath("/");
  return Response.json(created, { status: 201 });
}

// DECISION: URL validation message kept inline to avoid importing admin-fr in API route.
const adminFr_urlInvalid = "L'URL doit commencer par https:// ou http://";
