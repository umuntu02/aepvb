# A.E.P.V.B Website

Website for **Action pour l'Encadrement et la Promotion des Vulnérables au Burundi (A.E.P.V.B)** — Association for the Support and Promotion of Vulnerable People in Burundi.

## Features

- **Bilingual** — French (FR, default) and English (EN) with localStorage persistence
- **Multiple Themes** — Light, Dark, and High-Contrast modes with localStorage persistence
- **Accessible** — WCAG compliant with keyboard navigation, ARIA labels, skip links, and semantic HTML
- **Responsive** — Mobile-first design
- **Contact form** — Functional email delivery via Resend (requires `RESEND_API_KEY`)
- **Interactive map** — Leaflet-powered location map

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State**: Zustand + custom React context (theme, language)
- **Map**: Leaflet + react-leaflet
- **Database**: PostgreSQL via Drizzle ORM + postgres driver
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL database (for DB features)
- Resend account (for contact form)

### Installation

```bash
git clone <repository-url>
cd aepvb
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
# Required for contact form
RESEND_API_KEY=re_...

# Required for database features
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Optional — defaults to https://aepvb.org
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

## Database Setup

```bash
# Push schema to database (development)
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Open Drizzle Studio (DB browser)
npm run db:studio
```

## Project Structure

```
aepvb/
├── app/
│   ├── (public)/          # All public-facing page routes
│   │   ├── page.tsx       # Home page
│   │   ├── about/
│   │   ├── programs/
│   │   ├── programs/[slug]/
│   │   ├── news/
│   │   ├── news/[slug]/
│   │   ├── events/
│   │   ├── events/[slug]/
│   │   ├── gallery/
│   │   ├── donate/
│   │   └── contact/
│   ├── api/
│   │   └── contact/       # POST /api/contact — sends email via Resend
│   ├── layout.tsx         # Root layout (fonts, providers, Header, Footer)
│   └── globals.css        # Tailwind base styles
├── components/
│   ├── ui/                # shadcn/ui primitives (managed by shadcn CLI)
│   ├── sections/          # Composite page sections (Hero, HeroCarousel,
│   │                      #   Highlights, Members, News, Partners,
│   │                      #   Testimonials, CTA, Tools)
│   ├── Header.tsx         # Site header with language + theme switchers
│   ├── Footer.tsx         # Site footer
│   ├── ThemeProvider.tsx  # Re-exports from lib/theme/theme.ts
│   ├── LanguageProvider.tsx # FR/EN context + useTranslations hook
│   ├── Flag.tsx           # Flag icon (used in language switcher)
│   ├── Map.tsx            # Leaflet interactive map
│   └── ScrollToTop.tsx    # Scroll-to-top button
├── lib/
│   ├── i18n/              # Translation files (fr.ts, en.ts), types, server helper
│   ├── theme/             # Theme context (light/dark/high-contrast)
│   ├── constants/         # Mock data: programs, news, events, gallery, team, partners
│   ├── db/                # Drizzle ORM: index.ts, schema.ts, seed.ts
│   ├── metadata.ts        # Next.js metadata helpers
│   └── utils.ts           # cn() utility and shared helpers
├── styles/
│   └── tokens.css         # CSS design tokens
├── public/
│   ├── img/               # Site images
│   └── favicon_io/        # Favicon assets
├── drizzle.config.ts      # Drizzle ORM configuration (PostgreSQL)
└── components.json        # shadcn/ui configuration
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero carousel, highlights, news, partners, CTA |
| `/about` | Mission, vision, values, team, org structure |
| `/programs` | Program list with category filtering |
| `/programs/[slug]` | Individual program detail |
| `/news` | News articles with search and filtering |
| `/news/[slug]` | Individual news article |
| `/events` | Upcoming and past events |
| `/events/[slug]` | Individual event detail |
| `/gallery` | Photo gallery with lightbox |
| `/donate` | Donation form (UI only — no payment processing) |
| `/contact` | Contact form (functional — sends email via Resend) |

## Content Management

Most content is managed through mock data in `lib/constants/mock-data.ts` — programs, news, events, gallery items, team members, and partners. The database currently only backs the `news` table.

To add or modify content: edit the arrays in `lib/constants/mock-data.ts`.

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Full keyboard navigation (Tab, Enter/Space, Arrow Keys, Escape)
- Skip to content link
- Focus visible indicators
- High-contrast mode
- Alt text on all images
- Form validation with error messages
- Reduced motion support

## Browser Support

Chrome, Firefox, Safari, and Edge (latest versions).

## License

© 2024 A.E.P.V.B – Burundi. All rights reserved.

**Contact**: contact@aepvb.bi | +257 61 098 263
