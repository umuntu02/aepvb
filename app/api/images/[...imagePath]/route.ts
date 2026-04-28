import { readFile } from "fs/promises";
import { join, resolve } from "path";

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

function getBaseDir(): string {
  return resolve(process.env.UPLOAD_DIR ?? "./uploads");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imagePath: string[] }> }
) {
  const { imagePath } = await params;

  // Need at least contentType + filename
  if (!imagePath || imagePath.length < 2) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = imagePath[0];
  // DECISION: strict allowlist on first segment blocks path traversal via contentType.
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return new Response("Not found", { status: 404 });
  }

  // DECISION: reject traversal sequences in every segment before building path.
  if (
    imagePath.some(
      (s) => !s || s.includes("..") || s.includes("\\") || s.includes("\0")
    )
  ) {
    return new Response("Not found", { status: 404 });
  }

  const baseDir = getBaseDir();
  const filePath = resolve(join(baseDir, ...imagePath));

  // DECISION: path containment check as defense-in-depth against edge cases.
  if (!filePath.startsWith(baseDir + "/") && filePath !== baseDir) {
    return new Response("Not found", { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const filename = imagePath[imagePath.length - 1];
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
