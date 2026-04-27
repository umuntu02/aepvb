import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyAdminRequest, unauthorized } from "@/lib/admin/verify";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "news",
  "events",
  "gallery",
  "programs",
  "team",
  "partners",
]);

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorized();

  const form = await request.formData();
  const file = form.get("file");
  const contentType = String(form.get("contentType") ?? "");

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

  // DECISION: allowlist prevents path traversal via the contentType parameter.
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return Response.json({ error: "Type de contenu invalide." }, { status: 400 });
  }

  const ext = file.type === "image/webp" ? ".webp" : file.type === "image/png" ? ".png" : ".jpg";
  const base = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  const filename = `${base}-${Date.now()}${ext}`;

  const dir = join(process.cwd(), "public", "img", contentType);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  return Response.json({ path: `/img/${contentType}/${filename}` }, { status: 201 });
}
