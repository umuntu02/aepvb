import * as dotenv from "dotenv";
// Must load env vars before any DB import (ESM hoisting — see seed.ts pattern)
dotenv.config({ path: ".env.local" });

import { copyFile, mkdir } from "fs/promises";
import { join, resolve, basename } from "path";

// ---------------------------------------------------------------------------
// Migrates image paths stored as /img/[contentType]/[filename] in the DB to
// the persistent upload store, updating paths to /api/images/[contentType]/[filename].
// Safe to re-run: records already using /api/images/ are skipped.
// ---------------------------------------------------------------------------

const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR ?? "./uploads");
const PUBLIC_DIR = resolve("./public");

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function migrateColumn(
  tableName: string,
  imageColumn: string,
  rows: Array<{ id: number; imagePath: string | null }>
): Promise<void> {
  // Dynamic import so dotenv has already populated process.env.DATABASE_URL
  const { db } = await import("../lib/db/index.js");
  const { sql } = await import("drizzle-orm");

  let migrated = 0;
  let skipped = 0;
  let missing = 0;

  for (const row of rows) {
    const oldPath = row.imagePath;
    if (!oldPath) continue;

    // Already migrated — skip
    if (oldPath.startsWith("/api/images/")) {
      skipped++;
      continue;
    }

    // Only process paths from the old upload store
    if (!oldPath.startsWith("/img/")) {
      skipped++;
      continue;
    }

    // Extract contentType and filename from /img/[contentType]/[filename]
    const parts = oldPath.split("/");
    if (parts.length !== 4) {
      console.warn(`  Skipping malformed path: ${oldPath}`);
      skipped++;
      continue;
    }

    const contentType = parts[2];
    const filename = basename(parts[3]);
    const srcFile = join(PUBLIC_DIR, "img", contentType, filename);
    const destDir = join(UPLOAD_DIR, contentType);
    const destFile = join(destDir, filename);
    const newPath = `/api/images/${contentType}/${filename}`;

    // Copy file
    try {
      await ensureDir(destDir);
      await copyFile(srcFile, destFile);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        console.warn(`  Not found (skipped): ${oldPath}`);
        missing++;
        continue;
      }
      throw err;
    }

    // Update DB record
    await db.execute(
      sql.raw(`UPDATE ${tableName} SET "${imageColumn}" = '${newPath}' WHERE id = ${row.id}`)
    );

    console.log(`  Migrated: ${oldPath} → ${newPath}`);
    migrated++;
  }

  console.log(
    `  [${tableName}.${imageColumn}] migrated=${migrated}, skipped=${skipped}, missing=${missing}`
  );
}

async function main() {
  console.log("Starting image migration...\n");
  console.log(`Upload dir: ${UPLOAD_DIR}`);
  console.log(`Public dir: ${PUBLIC_DIR}\n`);

  const { db } = await import("../lib/db/index.js");
  const { news, programs, events, gallery, teamMembers, partners } =
    await import("../lib/db/schema.js");
  const { isNotNull } = await import("drizzle-orm");

  // ── news.image ─────────────────────────────────────────────────────────────
  console.log("→ news.image");
  const newsRows = await db
    .select({ id: news.id, imagePath: news.image })
    .from(news)
    .where(isNotNull(news.image));
  await migrateColumn("news", "image", newsRows);

  // ── programs.image ──────────────────────────────────────────────────────────
  console.log("\n→ programs.image");
  const programRows = await db
    .select({ id: programs.id, imagePath: programs.image })
    .from(programs);
  await migrateColumn("programs", "image", programRows);

  // ── events.image ───────────────────────────────────────────────────────────
  console.log("\n→ events.image");
  const eventRows = await db
    .select({ id: events.id, imagePath: events.image })
    .from(events)
    .where(isNotNull(events.image));
  await migrateColumn("events", "image", eventRows);

  // ── gallery.src ────────────────────────────────────────────────────────────
  console.log("\n→ gallery.src");
  const galleryRows = await db
    .select({ id: gallery.id, imagePath: gallery.src })
    .from(gallery);
  await migrateColumn("gallery", "src", galleryRows);

  // ── team_members.photo ─────────────────────────────────────────────────────
  console.log("\n→ team_members.photo");
  const teamRows = await db
    .select({ id: teamMembers.id, imagePath: teamMembers.photo })
    .from(teamMembers)
    .where(isNotNull(teamMembers.photo));
  await migrateColumn("team_members", "photo", teamRows);

  // ── partners.logo ──────────────────────────────────────────────────────────
  console.log("\n→ partners.logo");
  const partnerRows = await db
    .select({ id: partners.id, imagePath: partners.logo })
    .from(partners)
    .where(isNotNull(partners.logo));
  await migrateColumn("partners", "logo", partnerRows);

  console.log("\nMigration complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
