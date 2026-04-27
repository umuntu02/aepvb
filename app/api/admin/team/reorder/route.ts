import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

export async function PATCH(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const { items } = await request.json();
  if (!Array.isArray(items)) {
    return Response.json({ error: "items doit être un tableau" }, { status: 400 });
  }

  await Promise.all(
    (items as number[]).map((id, idx) =>
      db
        .update(teamMembers)
        .set({ ordinal: idx, updatedAt: new Date() })
        .where(eq(teamMembers.id, id))
    )
  );

  revalidatePath("/about");
  return Response.json({ ok: true });
}
