import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function PATCH(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  // DECISION: items is an ordered array of IDs; ordinal = array index.
  const { items } = await request.json();
  if (!Array.isArray(items)) {
    return Response.json({ error: "items doit être un tableau" }, { status: 400 });
  }

  await Promise.all(
    (items as number[]).map((id, idx) =>
      db.update(gallery).set({ ordinal: idx, updatedAt: new Date() }).where(eq(gallery.id, id))
    )
  );

  revalidatePath("/gallery");
  return Response.json({ ok: true });
}
