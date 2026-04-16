# Project Context

## What this is
Institutional website for **A.E.P.V.B** (Action pour l'Encadrement et la Promotion des Vulnérables au Burundi), a Burundian NGO founded in 2016 that supports vulnerable populations — deaf-mute individuals, orphans, albinos, the elderly, street children, widows, and teen mothers. The site targets donors, partners, and beneficiaries, providing bilingual (FR/EN) information about the association's mission, programs, news, events, gallery, and a functional contact form.

## Stack
- **Runtime**: Node.js 18+
- **Framework**: Next.js 16.1.1 — App Router, TypeScript 5
- **Styling**: Tailwind CSS v4 + custom CSS tokens (`styles/tokens.css`)
- **UI**: shadcn/ui (Radix UI primitives) — config in `components.json`
- **Icons**: Lucide React
- **State**: Zustand 5 (global) + custom React context for theme and language
- **Map**: Leaflet 1.9 + react-leaflet 5 (interactive location map)
- **Database**: PostgreSQL via Drizzle ORM + `postgres` driver
- **Email**: Resend (contact form — `app/api/contact/route.ts`)
- **Fonts**: Geist Sans + Geist Mono (Next.js Google Fonts integration)

## Structure
```
aepvb/
├── app/
│   ├── (public)/          # Route group — all public pages (no URL segment)
│   │   ├── page.tsx       # Home: hero carousel, highlights, news, partners, CTA
│   │   ├── about/         # Mission, vision, values, team, org structure
│   │   ├── programs/      # List + [slug] detail pages
│   │   ├── news/          # List + [slug] detail pages
│   │   ├── events/        # List + [slug] detail pages
│   │   ├── gallery/       # Photo gallery with lightbox
│   │   ├── donate/        # Donation form (UI only — no payment processing)
│   │   └── contact/       # Contact form (submits to /api/contact)
│   ├── api/contact/       # POST handler — validates fields, sends email via Resend
│   ├── layout.tsx         # Root layout: Geist fonts, ThemeProvider, LanguageProvider,
│   │                      #   Header, main#main-content, Footer, ScrollToTop
│   ├── globals.css        # Tailwind base + global resets
│   └── not-found.tsx      # Custom 404 page
├── components/
│   ├── ui/                # shadcn/ui primitives — DO NOT hand-edit (use shadcn CLI)
│   │                      #   accordion, badge, button, card, checkbox, dialog,
│   │                      #   input, radio-group, select, separator, skeleton,
│   │                      #   tabs, textarea
│   ├── sections/          # Composite home/page sections:
│   │                      #   Hero, HeroCarousel, Highlights, Members, News,
│   │                      #   Partners, Testimonials, CTA, Tools
│   ├── Header.tsx         # Site header: nav, FR/EN switcher, theme toggle
│   ├── Footer.tsx         # Site footer
│   ├── ThemeProvider.tsx  # Re-exports ThemeProvider + useTheme from lib/theme/theme.ts
│   ├── LanguageProvider.tsx # Re-exports LanguageProvider + useTranslations (also in lib/i18n)
│   ├── Flag.tsx           # Flag SVG icon used in language switcher
│   ├── Map.tsx            # react-leaflet map component
│   └── ScrollToTop.tsx    # Floating scroll-to-top button
├── lib/
│   ├── i18n/              # fr.ts + en.ts translation objects, types.ts, server.ts,
│   │                      #   index.ts (LanguageProvider + useTranslations hook)
│   ├── theme/             # theme.ts — ThemeProvider + useTheme (light/dark/high-contrast)
│   ├── constants/         # mock-data.ts — ALL site content: programs, news, events,
│   │                      #   gallery, team members, partners
│   ├── db/                # index.ts (Drizzle client), schema.ts (news table only),
│   │                      #   seed.ts (generic placeholder data — not AEPVB content)
│   ├── metadata.ts        # Next.js metadata helpers
│   └── utils.ts           # cn() (clsx + tailwind-merge) and shared helpers
├── styles/
│   └── tokens.css         # CSS custom properties for colors, spacing, typography
├── public/
│   ├── img/               # Site images
│   └── favicon_io/        # Favicon variants
├── drizzle.config.ts      # Drizzle config — PostgreSQL dialect, reads DATABASE_URL
└── components.json        # shadcn/ui config (path aliases, style)
```

## How to run

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local   # if exists, otherwise create manually
```

`.env.local` required variables:
```env
RESEND_API_KEY=re_...               # contact form email delivery
DATABASE_URL=postgresql://...       # PostgreSQL connection string
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # optional, defaults to https://aepvb.org
```

```bash
# Start dev server
npm run dev                         # → http://localhost:3000

# Database (requires DATABASE_URL)
npm run db:push                     # push schema to DB (dev shortcut, no migration files)
npm run db:generate                 # generate migration files
npm run db:migrate                  # run migrations
npm run db:seed                     # seed with placeholder news data
npm run db:studio                   # open Drizzle Studio browser

# Production
npm run build
npm start

# Lint
npm run lint
```

## Conventions & constraints

- **Language default is French.** Every user-facing string must have both `lib/i18n/fr.ts` and `lib/i18n/en.ts` entries with matching keys typed in `lib/i18n/types.ts`. Never hardcode display text.
- **Theme has three modes**: light, dark, high-contrast. All new UI must work in all three. Preferences persist via localStorage key `aepvb-theme`.
- **`components/ui/` is shadcn-managed** — do not hand-edit files there. Add new primitives with `npx shadcn add <component>`.
- **Content lives in `lib/constants/mock-data.ts`** — all bilingual content objects follow the `{ fr: string; en: string }` shape. The DB currently only has a `news` schema and is not wired to the front end yet.
- **Contact form is functional**: `POST /api/contact` validates fields and sends via Resend. It gracefully degrades (returns 503) when `RESEND_API_KEY` is missing. Do not revert this to UI-only.
- **Donation form is UI-only** — no payment integration exists. Do not wire payment without explicit instruction.
- **Accessibility is non-negotiable**: maintain semantic HTML, ARIA labels, keyboard nav, skip links, alt text, focus indicators, and reduced-motion support on all changes.
- **Route group `(public)/`** groups all user pages under a shared layout without adding a URL segment.
- **Design tokens first**: prefer `styles/tokens.css` custom properties over arbitrary Tailwind values.
- **`lib/i18n/server.ts`** exists for server component translation needs — use it instead of the client-side hook in Server Components.

## Current state

- **Working**: Full bilingual front-end — all pages (Home, About, Programs, News, Events, Gallery, Donate, Contact), three theme modes, WCAG accessibility, interactive Leaflet map, functional contact form via Resend.
- **DB is scaffolded but not connected to UI**: `lib/db/` has a PostgreSQL client and a `news` table schema, but the front end still reads from `lib/constants/mock-data.ts`. Seed data in `seed.ts` is generic English placeholder content, not real AEPVB news.
- **TODO/WIP**: Replace mock data with DB-backed content; wire `news` table to the news pages; expand DB schema to cover programs, events, gallery, team; implement donation processing.
- **Active work area**: `lib/db/` and `app/api/` — migrating from static mock content toward a real backend.

---
*Auto-generated from source — re-run this prompt if the project changes significantly.*
