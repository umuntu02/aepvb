# A.E.P.V.B Website

Website for Action pour l'Encadrement et la Promotion des Vulnérables au Burundi (A.E.P.V.B) - Association for the Support and Promotion of Vulnerable People in Burundi.

## Features

- 🌍 **Bilingual** - French (FR) and English (EN) language support
- 🎨 **Multiple Themes** - Light, Dark, and High-Contrast modes
- ♿ **Accessible** - WCAG compliant with keyboard navigation, ARIA labels, and semantic HTML
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🚀 **Modern Stack** - Next.js 16, TypeScript, Tailwind CSS, shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aepvb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
aepvb/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Home page
│   │   ├── about/
│   │   ├── programs/
│   │   ├── news/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── donate/
│   │   └── contact/
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── sections/          # Page sections (Hero, CTA, etc.)
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   ├── ThemeProvider.tsx  # Theme context
│   └── LanguageProvider.tsx # i18n context
├── lib/
│   ├── i18n/              # Translation files (fr.ts, en.ts)
│   ├── theme/             # Theme utilities
│   ├── constants/         # Mock data
│   └── utils.ts           # Utility functions
├── styles/
│   └── tokens.css         # Design tokens
└── public/
    └── img/               # Images
```

## Features Guide

### Switching Language

The website supports French and English. To switch languages:

1. **In Header**: Click the language button (FR/EN) in the top navigation
2. **On Mobile**: Open the menu and use the language switcher button
3. **Persistence**: Your language preference is saved in localStorage

The default language is French.

### Changing Theme

The website supports multiple theme modes:

1. **Light/Dark Mode**: 
   - Click the sun/moon icon in the header to toggle between light and dark modes

2. **High-Contrast Mode**:
   - Toggle the high-contrast checkbox in the header
   - Works with both light and dark modes
   - Provides enhanced contrast for better accessibility

3. **Persistence**: Your theme preferences are saved in localStorage

### Keyboard Navigation

All interactive elements are keyboard accessible:

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate in galleries and carousels
- **Escape**: Close modals and dialogs
- **Skip Link**: Press Tab on page load to skip to main content

### Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus visible indicators
- ✅ High contrast mode
- ✅ Skip to content link
- ✅ Alt text for all images
- ✅ Form validation with error messages
- ✅ Reduced motion support

## Development

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
```

### Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Pages

- **Home** (`/`) - Landing page with hero, mission, programs preview, news, events
- **About** (`/about`) - Mission, vision, values, team, organizational structure
- **Programs** (`/programs`) - List of all programs with filtering
- **Program Detail** (`/programs/[slug]`) - Individual program details
- **News** (`/news`) - News articles list with search and filtering
- **News Detail** (`/news/[slug]`) - Individual news article
- **Events** (`/events`) - Upcoming and past events
- **Event Detail** (`/events/[slug]`) - Individual event details
- **Gallery** (`/gallery`) - Photo gallery with lightbox
- **Donate** (`/donate`) - Donation form (UI only, no payment processing)
- **Contact** (`/contact`) - Contact form and information

## Content Management

Currently, all content is managed through mock data in:
- `lib/constants/mock-data.ts` - Programs, news, events, gallery, team, partners

To add or modify content, edit the respective arrays in this file.

## Notes

- This is a **front-end only** implementation
- No backend API or database
- Forms are UI-only (no actual submission)
- Donation page is UI-only (no payment processing)
- All images are stored in `public/img/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 A.E.P.V.B – Burundi. All rights reserved.## ContactFor questions or support, please visit the contact page or email: contact@aepvb.bi
