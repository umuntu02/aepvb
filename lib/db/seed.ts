import * as dotenv from "dotenv";
// Must run before any module that reads DATABASE_URL is imported
dotenv.config({ path: ".env.local" });

// Static imports that don't need DATABASE_URL are fine here
import { sql, isNull } from "drizzle-orm";
import {
  programs as programsData,
  newsArticles,
  events as eventsData,
  galleryImages,
  teamMembers as teamMembersData,
  partners as partnersData,
} from "../constants/mock-data";

async function seed() {
  // Dynamic import runs after dotenv has loaded env vars into process.env
  const { db } = await import("./index.js");
  const { news, programs, events, gallery, teamMembers, partners } =
    await import("./schema.js");

  console.log("Seeding database...");

  // Remove legacy seed data (English placeholder records with no slug)
  await db.delete(news).where(isNull(news.slug));

  // ── Programs ─────────────────────────────────────────────────────────────
  await db
    .insert(programs)
    .values(
      programsData.map((p) => ({
        slug: p.slug,
        titleFr: p.title.fr,
        titleEn: p.title.en,
        descriptionFr: p.description.fr,
        descriptionEn: p.description.en,
        fullDescriptionFr: p.fullDescription.fr,
        fullDescriptionEn: p.fullDescription.en,
        category: p.category,
        image: p.image,
        startDate: p.startDate,
        status: p.status,
        published: true,
      }))
    )
    .onConflictDoUpdate({
      target: programs.slug,
      set: {
        titleFr: sql`excluded.title_fr`,
        titleEn: sql`excluded.title_en`,
        descriptionFr: sql`excluded.description_fr`,
        descriptionEn: sql`excluded.description_en`,
        fullDescriptionFr: sql`excluded.full_description_fr`,
        fullDescriptionEn: sql`excluded.full_description_en`,
        category: sql`excluded.category`,
        image: sql`excluded.image`,
        startDate: sql`excluded.start_date`,
        status: sql`excluded.status`,
        updatedAt: sql`now()`,
      },
    });

  // ── Events ────────────────────────────────────────────────────────────────
  await db
    .insert(events)
    .values(
      eventsData.map((e) => ({
        slug: e.slug,
        titleFr: e.title.fr,
        titleEn: e.title.en,
        descriptionFr: e.description.fr,
        descriptionEn: e.description.en,
        locationFr: e.location.fr,
        locationEn: e.location.en,
        date: e.date,
        time: e.time,
        type: e.type,
        image: e.image ?? null,
        registrationRequired: e.registrationRequired,
        published: true,
      }))
    )
    .onConflictDoUpdate({
      target: events.slug,
      set: {
        titleFr: sql`excluded.title_fr`,
        titleEn: sql`excluded.title_en`,
        descriptionFr: sql`excluded.description_fr`,
        descriptionEn: sql`excluded.description_en`,
        locationFr: sql`excluded.location_fr`,
        locationEn: sql`excluded.location_en`,
        date: sql`excluded.date`,
        time: sql`excluded.time`,
        type: sql`excluded.type`,
        image: sql`excluded.image`,
        registrationRequired: sql`excluded.registration_required`,
        updatedAt: sql`now()`,
      },
    });

  // ── Gallery ───────────────────────────────────────────────────────────────
  await db
    .insert(gallery)
    .values(
      galleryImages.map((img, i) => ({
        src: img.src,
        altFr: img.alt.fr,
        altEn: img.alt.en,
        category: img.category,
        date: img.date ?? null,
        ordinal: i,
      }))
    )
    .onConflictDoUpdate({
      target: gallery.src,
      set: {
        altFr: sql`excluded.alt_fr`,
        altEn: sql`excluded.alt_en`,
        category: sql`excluded.category`,
        date: sql`excluded.date`,
        ordinal: sql`excluded.ordinal`,
        updatedAt: sql`now()`,
      },
    });

  // ── Team Members ──────────────────────────────────────────────────────────
  await db
    .insert(teamMembers)
    .values(
      teamMembersData.map((m, i) => ({
        name: m.name,
        roleFr: m.role.fr,
        roleEn: m.role.en,
        bioFr: m.bio.fr,
        bioEn: m.bio.en,
        photo: m.image ?? null,
        ordinal: i,
      }))
    )
    .onConflictDoUpdate({
      target: teamMembers.name,
      set: {
        roleFr: sql`excluded.role_fr`,
        roleEn: sql`excluded.role_en`,
        bioFr: sql`excluded.bio_fr`,
        bioEn: sql`excluded.bio_en`,
        photo: sql`excluded.photo`,
        ordinal: sql`excluded.ordinal`,
        updatedAt: sql`now()`,
      },
    });

  // ── Partners ──────────────────────────────────────────────────────────────
  await db
    .insert(partners)
    .values(
      partnersData.map((p, i) => ({
        name: p.name,
        logo: p.logo ?? null,
        website: p.website ?? null,
        ordinal: i,
      }))
    )
    .onConflictDoUpdate({
      target: partners.name,
      set: {
        logo: sql`excluded.logo`,
        website: sql`excluded.website`,
        ordinal: sql`excluded.ordinal`,
        updatedAt: sql`now()`,
      },
    });

  // ── News ──────────────────────────────────────────────────────────────────
  await db
    .insert(news)
    .values(
      newsArticles.map((a) => ({
        // Legacy non-null columns set to French values
        title: a.title.fr,
        content: a.content.fr,
        author: a.author,
        category: a.category,
        // Bilingual columns
        slug: a.slug,
        titleFr: a.title.fr,
        titleEn: a.title.en,
        contentFr: a.content.fr,
        contentEn: a.content.en,
        excerptFr: a.excerpt.fr,
        excerptEn: a.excerpt.en,
        image: a.image,
        date: a.date,
        featured: a.featured,
        published: true,
      }))
    )
    .onConflictDoUpdate({
      target: news.slug,
      set: {
        title: sql`excluded.title`,
        content: sql`excluded.content`,
        author: sql`excluded.author`,
        category: sql`excluded.category`,
        titleFr: sql`excluded.title_fr`,
        titleEn: sql`excluded.title_en`,
        contentFr: sql`excluded.content_fr`,
        contentEn: sql`excluded.content_en`,
        excerptFr: sql`excluded.excerpt_fr`,
        excerptEn: sql`excluded.excerpt_en`,
        image: sql`excluded.image`,
        date: sql`excluded.date`,
        featured: sql`excluded.featured`,
        updatedAt: sql`now()`,
      },
    });

  console.log(
    `Seeded: ${programsData.length} programs, ${eventsData.length} events, ` +
      `${galleryImages.length} gallery items, ${teamMembersData.length} team members, ` +
      `${partnersData.length} partners, ${newsArticles.length} news articles`
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
