import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { getCTA, updateCTA } from "@/lib/db/queries/cta";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorized();
  const row = await getCTA();
  return Response.json(row);
}

export async function PUT(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const body = await request.json();
  if (!body.titleFr || !body.titleEn || !body.buttonLabelFr || !body.buttonLabelEn || !body.buttonUrl) {
    return Response.json(
      { error: "Champs obligatoires : titleFr, titleEn, buttonLabelFr, buttonLabelEn, buttonUrl" },
      { status: 400 }
    );
  }
  if (body.buttonUrl && !/^https?:\/\/|^\//i.test(body.buttonUrl)) {
    return Response.json({ error: "URL invalide" }, { status: 400 });
  }
  const row = await updateCTA(body);
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(row);
}
