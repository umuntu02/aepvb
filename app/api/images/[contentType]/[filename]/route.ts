import { readFile } from "fs/promises";
import { join } from "path";
import { getUploadDir } from "@/lib/upload";

const ALLOWED_CONTENT_TYPES = new Set([
  "news",
  "events",
  "gallery",
  "programs",
  "team",
  "partners",
]);

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contentType: string; filename: string }> }
) {
  const { contentType, filename } = await params;

  // DECISION: strict allowlist on contentType blocks path traversal attempts.
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return new Response("Not found", { status: 404 });
  }

  // DECISION: reject filenames with path separators — the only valid filenames
  // are the ones we generated at upload time (no slashes, no traversal).
  if (
    !filename ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..")
  ) {
    return new Response("Not found", { status: 404 });
  }

  let dir: string;
  try {
    dir = await getUploadDir(contentType);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const filePath = join(dir, filename);

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeType = MIME_MAP[ext] ?? "application/octet-stream";

  // DECISION: immutable + 1-year max-age is safe because filenames include a
  // timestamp prefix — the same filename always returns the same bytes.
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
