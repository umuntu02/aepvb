import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { getTestimonialById, updateTestimonial, deleteTestimonial } from "@/lib/db/queries/testimonials";
import { deleteUploadedFile } from "@/lib/upload";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const { id } = await params;
  const row = await getTestimonialById(Number(id));
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });
  return Response.json(row);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const { id } = await params;
  const body = await request.json();
  const row = await updateTestimonial(Number(id), body);
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(row);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const { id } = await params;
  const { status } = await request.json();
  if (status !== "draft" && status !== "published") {
    return Response.json({ error: "Statut invalide" }, { status: 400 });
  }
  const row = await updateTestimonial(Number(id), { status });
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/admin");
  return Response.json(row);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminRequest())) return unauthorized();
  const { id } = await params;
  const row = await getTestimonialById(Number(id));
  if (!row) return Response.json({ error: "Introuvable" }, { status: 404 });
  await deleteUploadedFile(row.authorPhoto);
  await deleteTestimonial(Number(id));
  revalidatePath("/");
  revalidatePath("/admin");
  return new Response(null, { status: 204 });
}
