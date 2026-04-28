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
  const { news, programs, events, gallery, teamMembers, partners,
          heroSlides, highlights, testimonials, ctaBlock } =
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

  // ── Hero Slides ───────────────────────────────────────────────────────────
  // DECISION: seeded from the images previously hardcoded in Hero.tsx
  const heroSlidesData = [
    { image: "/img/IMG_20200731_123515.png", altFr: "Communauté AEPVB", altEn: "AEPVB Community", titleFr: "Action pour l'Encadrement et la Promotion des Vulnérables au Burundi", titleEn: "Action for the Support and Promotion of Vulnerable People in Burundi", ordinal: 0 },
    { image: "/img/IMG_20200731_135408.jpg", altFr: "Activités AEPVB", altEn: "AEPVB Activities", titleFr: "Nos Activités", titleEn: "Our Activities", ordinal: 1 },
    { image: "/img/IMG_20200731_135419.jpg", altFr: "Programmes AEPVB", altEn: "AEPVB Programs", titleFr: "Nos Programmes", titleEn: "Our Programs", ordinal: 2 },
    { image: "/img/IMG_20200731_140253.jpg", altFr: "Événements AEPVB", altEn: "AEPVB Events", titleFr: "Nos Événements", titleEn: "Our Events", ordinal: 3 },
  ];
  for (const slide of heroSlidesData) {
    await db
      .insert(heroSlides)
      .values({ ...slide, status: "published" })
      .onConflictDoNothing();
  }

  // ── Highlights (Chiffres clés) ────────────────────────────────────────────
  // DECISION: seeded with statistics derived from AEPVB mission content
  const highlightsData = [
    { icon: "Users", valueFr: "1500+", valueEn: "1500+", labelFr: "Personnes aidées", labelEn: "People helped", ordinal: 0 },
    { icon: "BookOpen", valueFr: "10", valueEn: "10", labelFr: "Programmes actifs", labelEn: "Active programs", ordinal: 1 },
    { icon: "Handshake", valueFr: "8", valueEn: "8", labelFr: "Partenaires", labelEn: "Partners", ordinal: 2 },
    { icon: "Calendar", valueFr: "2016", valueEn: "2016", labelFr: "Année de fondation", labelEn: "Founded in", ordinal: 3 },
  ];
  for (const h of highlightsData) {
    await db
      .insert(highlights)
      .values({ ...h, status: "published" })
      .onConflictDoNothing();
  }

  // ── Testimonials ──────────────────────────────────────────────────────────
  // DECISION: seeded from the defaultTestimonials previously hardcoded in Testimonials.tsx
  const testimonialsData = [
    {
      authorName: "Parent",
      authorRoleFr: "Parent d'élève",
      authorRoleEn: "Parent",
      authorPhoto: "/img/IMG_8674.JPG",
      contentFr: "Ma plus grande satisfaction est de voir la réussite de mes enfants grâce au soutien de l'AEPVB.",
      contentEn: "My greatest satisfaction is seeing my children's success thanks to AEPVB's support.",
      ordinal: 0,
    },
    {
      authorName: "Étudiant",
      authorRoleFr: "Étudiant bénéficiaire",
      authorRoleEn: "Beneficiary student",
      authorPhoto: "/img/IMG_8685.JPG",
      contentFr: "Toutes les conditions étaient remplies pour bien étudier. L'AEPVB a changé ma vie.",
      contentEn: "All conditions were met for good study. AEPVB changed my life.",
      ordinal: 1,
    },
  ];
  for (const t of testimonialsData) {
    await db
      .insert(testimonials)
      .values({ ...t, status: "published" })
      .onConflictDoNothing();
  }

  // ── CTA Block ─────────────────────────────────────────────────────────────
  // DECISION: upsert by id=1 — single-row table, re-runnable without duplicating
  await db
    .insert(ctaBlock)
    .values({
      id: 1,
      titleFr: "Soutenez Notre Cause",
      titleEn: "Support Our Cause",
      subtitleFr: "Votre contribution fait la différence dans la vie des personnes vulnérables",
      subtitleEn: "Your contribution makes a difference in the lives of vulnerable people",
      buttonLabelFr: "Faire un don",
      buttonLabelEn: "Donate",
      buttonUrl: "/donate",
      status: "published",
    })
    .onConflictDoUpdate({
      target: ctaBlock.id,
      set: {
        titleFr: sql`excluded.title_fr`,
        titleEn: sql`excluded.title_en`,
        subtitleFr: sql`excluded.subtitle_fr`,
        subtitleEn: sql`excluded.subtitle_en`,
        buttonLabelFr: sql`excluded.button_label_fr`,
        buttonLabelEn: sql`excluded.button_label_en`,
        buttonUrl: sql`excluded.button_url`,
        updatedAt: sql`now()`,
      },
    });

  console.log(
    `Seeded: ${programsData.length} programs, ${eventsData.length} events, ` +
      `${galleryImages.length} gallery items, ${teamMembersData.length} team members, ` +
      `${partnersData.length} partners, ${newsArticles.length} news articles, ` +
      `${heroSlidesData.length} hero slides, ${highlightsData.length} highlights, ` +
      `${testimonialsData.length} testimonials, 1 CTA block`
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
