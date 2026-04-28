import { writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";
import { getAlbumDir, getAlbumPublicPath, deleteUploadedFile } from "@/lib/upload";
import {
  getPhotosByEventId,
  getPhotosByNewsId,
  addPhoto,
  removePhoto,
  updatePhotoAlt,
} from "@/lib/db/queries/albums";
import { db } from "@/lib/db";
import { events, news } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["events", "news"]);

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

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

function revalidatePublicPaths(contentType: string, slug: string): void {
  if (contentType === "events") {
    revalidatePath(`/events/${slug}`);
    revalidatePath(`/events/${slug}/photos`);
  } else {
    revalidatePath(`/news/${slug}`);
    revalidatePath(`/news/${slug}/photos`);
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ contentType: string; id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const { contentType, id } = await params;
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return Response.json({ error: "Type invalide" }, { status: 400 });
  }

  const numId = parseInt(id);
  if (isNaN(numId)) return Response.json({ error: "ID invalide" }, { status: 400 });

  const photos =
    contentType === "events"
      ? await getPhotosByEventId(numId)
      : await getPhotosByNewsId(numId);

  return Response.json(photos);
}

export async function POST(
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

  const form = await req.formData();
  const file = form.get("file");
  const altFr = String(form.get("alt_fr") ?? "").trim();
  const altEn = String(form.get("alt_en") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim();

  if (!(file instanceof File)) {
    return Response.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: "Format invalide. Utilisez JPG, PNG ou WEBP." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Fichier trop volumineux (max 5 Mo)." }, { status: 400 });
  }
  if (!slug) return Response.json({ error: "Slug manquant" }, { status: 400 });
  if (!altFr) return Response.json({ error: "alt_fr requis" }, { status: 400 });
  if (!altEn) return Response.json({ error: "alt_en requis" }, { status: 400 });

  const ext =
    file.type === "image/webp" ? ".webp" : file.type === "image/png" ? ".png" : ".jpg";
  const base = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  // DECISION: timestamp prefix makes filenames unique — enables Cache-Control: immutable.
  const filename = `${Date.now()}-${base}${ext}`;

  const existingPhotos =
    contentType === "events"
      ? await getPhotosByEventId(numId)
      : await getPhotosByNewsId(numId);
  const ordinal = existingPhotos.length;

  const dir = await getAlbumDir(contentType as "events" | "news", slug);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  const imagePath = getAlbumPublicPath(contentType as "events" | "news", slug, filename);
  const photo = await addPhoto({
    eventId: contentType === "events" ? numId : undefined,
    newsId: contentType === "news" ? numId : undefined,
    image: imagePath,
    altFr,
    altEn,
    ordinal,
  });

  revalidatePublicPaths(contentType, slug);

  return Response.json(photo, { status: 201 });
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
  const { photoId, altFr, altEn } = body;

  if (!photoId || typeof photoId !== "number") {
    return Response.json({ error: "photoId manquant" }, { status: 400 });
  }
  if (!altFr?.trim() || !altEn?.trim()) {
    return Response.json({ error: "Textes alternatifs requis" }, { status: 400 });
  }

  await updatePhotoAlt(photoId, altFr.trim(), altEn.trim());

  const slug = await getParentSlug(contentType, numId);
  if (slug) revalidatePublicPaths(contentType, slug);

  return Response.json({ ok: true });
}

export async function DELETE(
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
  const { photoId } = body;

  if (!photoId || typeof photoId !== "number") {
    return Response.json({ error: "photoId manquant" }, { status: 400 });
  }

  const slug = await getParentSlug(contentType, numId);
  const imagePath = await removePhoto(photoId);

  if (imagePath) {
    await deleteUploadedFile(imagePath);
  }

  if (slug) revalidatePublicPaths(contentType, slug);

  return Response.json({ ok: true });
}
