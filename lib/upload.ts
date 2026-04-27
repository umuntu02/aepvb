import { mkdir, unlink } from "fs/promises";
import { join, resolve } from "path";

const ALLOWED_CONTENT_TYPES = new Set([
  "news",
  "events",
  "gallery",
  "programs",
  "team",
  "partners",
]);

// DECISION: UPLOAD_DIR env var lets dev/VPS use different base paths without
// code changes. Falls back to ./uploads so local dev works out-of-the-box.
function getBaseDir(): string {
  const raw = process.env.UPLOAD_DIR ?? "./uploads";
  return resolve(raw);
}

export async function getUploadDir(contentType: string): Promise<string> {
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(`Invalid content type: ${contentType}`);
  }
  const dir = join(getBaseDir(), contentType);
  await mkdir(dir, { recursive: true });
  return dir;
}

export function getPublicPath(contentType: string, filename: string): string {
  return `/api/images/${contentType}/${filename}`;
}

// Deletes an image that was stored via the upload route.
// Safe to call with any path: silently no-ops on /img/ paths (static files)
// and on missing files — the caller's DB operation must not be blocked.
export async function deleteUploadedFile(
  imagePath: string | null | undefined
): Promise<void> {
  if (!imagePath?.startsWith("/api/images/")) return;

  const parts = imagePath.split("/");
  // "/api/images/contentType/filename" → ["", "api", "images", contentType, filename]
  if (parts.length !== 5) return;

  const contentType = parts[3];
  const filename = parts[4];

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) return;
  // DECISION: reject filenames with traversal sequences before building path.
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) return;

  const filePath = join(getBaseDir(), contentType, filename);
  try {
    await unlink(filePath);
  } catch {
    console.warn(`[upload] Could not delete file: ${imagePath}`);
  }
}
