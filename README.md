# ReResell - Marketplace for Second-hand Items

A Carousell-style marketplace for buying and selling pre-loved items, built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Email/password and Google OAuth
- **Listings**: Create, edit, delete listings with multiple images
- **Search & Discovery**: Filter by category, price, condition, location
- **Favorites**: Save listings to your watchlist
- **Real-time Chat**: Message buyers/sellers (requires Pusher setup)
- **Offers**: Make and respond to offers
- **Reviews**: Rate users after transactions
- **Mobile-first Design**: Responsive UI with bottom navigation

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: PostgreSQL (Neon recommended)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Storage**: Vercel Blob
- **Real-time**: Pusher

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (we recommend [Neon](https://neon.tech))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd recycle-resell
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Pusher (optional, for real-time chat)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
```

### 3. Database Setup

Push the schema to your database:

```bash
npm run db:push
```

Seed the database with sample data:

```bash
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── api/               # API routes
│   ├── listing/           # Listing pages
│   └── search/            # Search page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, MobileNav
│   ├── listings/          # Listing card, grid, etc.
│   ├── auth/              # Auth forms
│   └── forms/             # Form components
├── lib/                   # Utilities and configs
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Zod schemas
└── types/                 # TypeScript types
```

## Test Accounts

After seeding the database, you can log in with:

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |
| carol@example.com | password123 |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

1. Build the project: `npm run build`
2. Start the server: `npm run start`

## Environment Variables for Production

Make sure to set these in your production environment:

- `DATABASE_URL` - Your production PostgreSQL URL
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Generate a secure secret
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

## License

MIT
