import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// news — extended from the original single-language schema.
// Legacy columns (title, content, author, category) are kept so that any
// tooling that read them before this migration still works.
// ---------------------------------------------------------------------------
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  // Legacy single-language columns — kept for backward compatibility
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  // DECISION: slug added for [slug] route resolution
  slug: varchar("slug", { length: 255 }).unique(),
  titleFr: text("title_fr"),
  titleEn: text("title_en"),
  contentFr: text("content_fr"),
  contentEn: text("content_en"),
  excerptFr: text("excerpt_fr"),
  excerptEn: text("excerpt_en"),
  image: text("image"),
  // DECISION: 'date' is the editorial publication date, separate from created_at
  date: date("date"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  // DECISION: slug is unique — used for /programs/[slug] route resolution
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionEn: text("description_en").notNull(),
  // DECISION: fullDescription stored separately from description for
  // list-card (description) vs detail-page (fullDescription) rendering
  fullDescriptionFr: text("full_description_fr").notNull(),
  fullDescriptionEn: text("full_description_en").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  image: text("image").notNull(),
  startDate: date("start_date"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionEn: text("description_en").notNull(),
  locationFr: text("location_fr").notNull(),
  locationEn: text("location_en").notNull(),
  // DECISION: date column enables upcoming/past split via DB-side comparison
  date: date("date").notNull(),
  time: varchar("time", { length: 10 }),
  type: varchar("type", { length: 20 }).notNull(),
  image: text("image"),
  registrationRequired: boolean("registration_required").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  // DECISION: src is unique — each image file appears once in the gallery
  src: text("src").unique().notNull(),
  altFr: text("alt_fr").notNull(),
  altEn: text("alt_en").notNull(),
  category: varchar("category", { length: 50 }),
  // DECISION: date is nullable — not all gallery images have a documented date
  date: date("date"),
  ordinal: integer("ordinal").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  // DECISION: name is unique — used as natural key for upsert
  name: varchar("name", { length: 255 }).unique().notNull(),
  roleFr: text("role_fr").notNull(),
  roleEn: text("role_en").notNull(),
  bioFr: text("bio_fr").notNull(),
  bioEn: text("bio_en").notNull(),
  // DECISION: photo is nullable — no team member has a photo in the initial dataset
  photo: text("photo"),
  ordinal: integer("ordinal").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  // DECISION: name is unique — used as natural key for upsert
  name: text("name").unique().notNull(),
  // DECISION: logo is nullable — no partner has a logo in the initial dataset
  logo: text("logo"),
  altFr: text("alt_fr"),
  altEn: text("alt_en"),
  website: text("website"),
  ordinal: integer("ordinal").default(0).notNull(),
  // DECISION: status mirrors hero_slides pattern — 'draft'|'published'
  status: text("status").default("published").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// DECISION: no separate albums table — the album IS the event or news article.
// album_photos links directly to the parent record. Exactly one of event_id or
// news_id must be set — enforced in application layer.
export const albumPhotos = pgTable("album_photos", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id, { onDelete: "cascade" }),
  newsId: integer("news_id").references(() => news.id, { onDelete: "cascade" }),
  image: text("image").notNull(),
  altFr: text("alt_fr").notNull(),
  altEn: text("alt_en").notNull(),
  ordinal: integer("ordinal").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// hero_slides — each row is one background slide in the home page hero carousel.
// Ordinal controls display order. Status drives draft/publish workflow.
// DECISION: per-slide title/subtitle/CTA stored for future rich-slide design;
// current carousel uses image+alt only, so no wasted columns on publish.
// ---------------------------------------------------------------------------
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  altFr: text("alt_fr").notNull(),
  altEn: text("alt_en").notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  subtitleFr: text("subtitle_fr"),
  subtitleEn: text("subtitle_en"),
  ctaLabelFr: text("cta_label_fr"),
  ctaLabelEn: text("cta_label_en"),
  ctaUrl: text("cta_url"),
  ordinal: integer("ordinal").default(0).notNull(),
  // DECISION: status text vs boolean — allows future 'scheduled' state
  status: text("status").default("published").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// highlights — key statistics displayed as a "Chiffres clés" section on home.
// icon is a Lucide icon name string rendered client-side via dynamic lookup.
// ---------------------------------------------------------------------------
export const highlights = pgTable("highlights", {
  id: serial("id").primaryKey(),
  icon: text("icon"),
  valueFr: text("value_fr").notNull(),
  valueEn: text("value_en").notNull(),
  labelFr: text("label_fr").notNull(),
  labelEn: text("label_en").notNull(),
  ordinal: integer("ordinal").default(0).notNull(),
  status: text("status").default("published").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// testimonials — quotes from beneficiaries/parents displayed on home page.
// author_photo is optional; content_fr/en is the testimonial body.
// ---------------------------------------------------------------------------
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorRoleFr: text("author_role_fr"),
  authorRoleEn: text("author_role_en"),
  authorPhoto: text("author_photo"),
  contentFr: text("content_fr").notNull(),
  contentEn: text("content_en").notNull(),
  ordinal: integer("ordinal").default(0).notNull(),
  status: text("status").default("published").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// cta_block — single-row table for the home page donate CTA.
// DECISION: single row enforced in UI (edit only, no create button).
// Seeded with a default row; admins may only update it.
// ---------------------------------------------------------------------------
export const ctaBlock = pgTable("cta_block", {
  id: serial("id").primaryKey(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  subtitleFr: text("subtitle_fr"),
  subtitleEn: text("subtitle_en"),
  buttonLabelFr: text("button_label_fr").notNull(),
  buttonLabelEn: text("button_label_en").notNull(),
  buttonUrl: text("button_url").notNull(),
  status: text("status").default("published").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type HeroSlideRow = typeof heroSlides.$inferSelect;
export type NewHeroSlide = typeof heroSlides.$inferInsert;
export type HighlightRow = typeof highlights.$inferSelect;
export type NewHighlight = typeof highlights.$inferInsert;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type CtaBlockRow = typeof ctaBlock.$inferSelect;
export type NewCtaBlock = typeof ctaBlock.$inferInsert;

export type AlbumPhotoRow = typeof albumPhotos.$inferSelect;
export type NewAlbumPhoto = typeof albumPhotos.$inferInsert;

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type ProgramRow = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type EventRow = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type GalleryRow = typeof gallery.$inferSelect;
export type NewGallery = typeof gallery.$inferInsert;
export type TeamMemberRow = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type PartnerRow = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
