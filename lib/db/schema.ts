import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  organization: varchar('organization', { length: 100 }).notNull(),
  eventDate: timestamp('event_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
