# AEPVB - Next.js App with PostgreSQL & Drizzle ORM

A modern Next.js application built with TypeScript, TailwindCSS, shadcn UI, PostgreSQL, Drizzle ORM, and Zustand.

## Features

- ⚡ Next.js 16 with App Router
- 🎨 TailwindCSS for styling
- 🎯 shadcn UI components
- 🗄️ PostgreSQL database with Drizzle ORM
- 🐻 Zustand for state management
- 📰 News/Events management system

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or remote)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/aepvb
```

Replace `user`, `password`, `localhost`, `5432`, and `aepvb` with your PostgreSQL credentials.

### 3. Create Database

Create the database in PostgreSQL:

```bash
createdb aepvb
```

Or using psql:

```sql
CREATE DATABASE aepvb;
```

### 4. Generate and Run Migrations

Generate the database schema:

```bash
npm run db:generate
```

Push the schema to the database:

```bash
npm run db:push
```

Alternatively, you can use migrations:

```bash
npm run db:migrate
```

### 5. Seed the Database

Populate the database with sample organization event news:

```bash
npm run seed
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── news/
│   │       └── route.ts      # API route for fetching news
│   ├── page.tsx               # Homepage displaying news
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # shadcn UI components
├── lib/
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Drizzle schema definitions
│   ├── store/
│   │   └── news-store.ts     # Zustand store for news
│   └── utils.ts              # Utility functions
├── scripts/
│   └── seed.ts               # Database seeding script
└── drizzle.config.ts         # Drizzle configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run seed` - Seed database with sample data

## Database Schema

### News Table

- `id` - Serial primary key
- `title` - News title (varchar 255)
- `content` - News content (text)
- `author` - Author name (varchar 100)
- `organization` - Organization name (varchar 100)
- `eventDate` - Optional event date (timestamp)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **shadcn UI** - Component library
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe SQL ORM
- **Zustand** - State management
- **ESLint** - Code linting

## License

MIT
