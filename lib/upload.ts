import { mkdir, unlink } from "fs/promises";
import { join, resolve } from "path";

const ALLOWED_CONTENT_TYPES = new Set([
  "news",
  "events",
  "gallery",
  "programs",
  "team",
  "partners",
  "hero",
  "testimonials",
]);

// DECISION: UPLOAD_DIR env var lets dev/VPS use different base paths without
// code changes. Falls back to ./uploads so local dev works out-of-the-box.
function getBaseDir(): string {
  const raw = process.env.UPLOAD_DIR ?? "./uploads";
  return resolve(raw);
}

// contentTypePath may be a bare type ('events') or a subpath ('events/album-slug').
// The first segment must be in ALLOWED_CONTENT_TYPES; no traversal is allowed.
export async function getUploadDir(contentTypePath: string): Promise<string> {
  const firstSegment = contentTypePath.split("/")[0];
  if (!ALLOWED_CONTENT_TYPES.has(firstSegment)) {
    throw new Error(`Invalid content type: ${firstSegment}`);
  }
  if (
    contentTypePath.includes("..") ||
    contentTypePath.includes("\\") ||
    contentTypePath.includes("\0")
  ) {
    throw new Error(`Invalid path: ${contentTypePath}`);
  }
  const dir = join(getBaseDir(), ...contentTypePath.split("/"));
  await mkdir(dir, { recursive: true });
  return dir;
}

export function getPublicPath(contentType: string, filename: string): string {
  return `/api/images/${contentType}/${filename}`;
}

// Returns the absolute path for an album directory and creates it if absent.
export async function getAlbumDir(
  contentType: "events" | "news",
  slug: string
): Promise<string> {
  const dir = join(getBaseDir(), contentType, `album-${slug}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

// Returns the public URL path for a photo inside an album.
export function getAlbumPublicPath(
  contentType: "events" | "news",
  slug: string,
  filename: string
): string {
  return `/api/images/${contentType}/album-${slug}/${filename}`;
}

// Deletes an image stored via the upload route.
// Handles flat paths (/api/images/contentType/filename) and
// album paths (/api/images/contentType/album-slug/filename).
// Safe to call with any path: silently no-ops on /img/ paths and missing files.
export async function deleteUploadedFile(
  imagePath: string | null | undefined
): Promise<void> {
  if (!imagePath?.startsWith("/api/images/")) return;

  const parts = imagePath.split("/");
  // ["", "api", "images", ...segments]
  const segments = parts.slice(3);

  if (segments.length < 2) return;

  const contentType = segments[0];
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) return;

  // DECISION: reject any traversal sequence in any segment before building path.
  if (
    segments.some(
      (s) => !s || s.includes("..") || s.includes("\\") || s.includes("\0")
    )
  )
    return;

  const filePath = join(getBaseDir(), ...segments);
  try {
    await unlink(filePath);
  } catch {
    console.warn(`[upload] Could not delete file: ${imagePath}`);
  }
}
