import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { reorderPhotos } from "@/lib/db/queries/albums";
import { db } from "@/lib/db";
import { events, news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ALLOWED_CONTENT_TYPES = new Set(["events", "news"]);

async function getParentSlug(contentType: string, id: number): Promise<string | null> {
  if (contentType === "events") {
    const [row] = await db
      .select({ slug: events.slug })
      .from(events)
      .where(eq(events.id, id))
      .limit(1);
    return row?.slug ?? null;
  }
  const [row] = await db
    .select({ slug: news.slug })
    .from(news)
    .where(eq(news.id, id))
    .limit(1);
  return row?.slug ?? null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ contentType: string; id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const { contentType, id } = await params;
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return Response.json({ error: "Type invalide" }, { status: 400 });
  }

  const numId = parseInt(id);
  if (isNaN(numId)) return Response.json({ error: "ID invalide" }, { status: 400 });

  const body = await req.json();
  const { orderedIds } = body;

  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((id) => typeof id !== "number")
  ) {
    return Response.json({ error: "orderedIds invalide" }, { status: 400 });
  }

  await reorderPhotos(orderedIds);

  const slug = await getParentSlug(contentType, numId);
  if (slug) {
    if (contentType === "events") {
      revalidatePath(`/events/${slug}`);
      revalidatePath(`/events/${slug}/photos`);
    } else {
      revalidatePath(`/news/${slug}`);
      revalidatePath(`/news/${slug}/photos`);
    }
  }

  return Response.json({ ok: true });
}
