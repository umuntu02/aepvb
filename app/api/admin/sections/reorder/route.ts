import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { reorderSlides } from "@/lib/db/queries/hero";
import { reorderHighlights } from "@/lib/db/queries/highlights";
import { reorderTestimonials } from "@/lib/db/queries/testimonials";
import { reorderPartners } from "@/lib/db/queries/partners";

// DECISION: single reorder endpoint dispatches by "section" body field
// to keep client code simple. Avoids duplicating route logic per section.
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const body = await request.json();
  const { section, orderedIds } = body as { section: string; orderedIds: number[] };

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return Response.json({ error: "orderedIds requis" }, { status: 400 });
  }

  switch (section) {
    case "hero":
      await reorderSlides(orderedIds);
      break;
    case "highlights":
      await reorderHighlights(orderedIds);
      break;
    case "testimonials":
      await reorderTestimonials(orderedIds);
      break;
    case "partners":
      await reorderPartners(orderedIds);
      break;
    default:
      return Response.json({ error: "Section inconnue" }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json({ ok: true });
}
