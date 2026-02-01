# ReResell

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[Live Demo](https://recycle-resell.netlify.app)** | **[Documentation](https://alfredang.github.io/recycle-resell)**

A modern, Carousell-style marketplace for buying and selling second-hand items. Built with Next.js, TypeScript, and Tailwind CSS.

![ReResell Screenshot](docs/images/screenshot.png)

## About

ReResell is a full-stack marketplace application that enables users to buy and sell pre-loved items. The platform promotes sustainability by giving items a second life while helping users save money.

### Key Features

- **User Authentication** - Secure login with email/password or Google OAuth
- **Listing Management** - Create, edit, and manage listings with multiple images
- **Advanced Search** - Filter by category, price range, condition, and location
- **Favorites** - Save listings to your personal watchlist
- **Real-time Chat** - Message buyers and sellers instantly
- **Offer System** - Make and negotiate offers on listings
- **User Reviews** - Build trust with ratings after transactions
- **Responsive Design** - Mobile-first UI with bottom navigation

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Database** | PostgreSQL (Neon Serverless) |
| **ORM** | Prisma 7 |
| **Authentication** | NextAuth.js v5 |
| **Storage** | Vercel Blob |
| **Real-time** | Pusher |
| **Deployment** | Netlify / Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/alfredang/recycle-resell.git
cd recycle-resell

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
npm run db:push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Accounts

After seeding, you can log in with:

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |
| carol@example.com | password123 |

## Documentation

For detailed documentation, visit our [GitHub Pages documentation site](https://alfredang.github.io/recycle-resell).

- [Getting Started](https://alfredang.github.io/recycle-resell/getting-started/)
- [Configuration](https://alfredang.github.io/recycle-resell/configuration/)
- [API Reference](https://alfredang.github.io/recycle-resell/api/)
- [Deployment](https://alfredang.github.io/recycle-resell/deployment/)

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
│   ├── listings/          # Listing components
│   └── auth/              # Auth forms
├── lib/                   # Utilities and configs
└── types/                 # TypeScript types
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Optional - Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional - Image uploads
BLOB_READ_WRITE_TOKEN=""

# Optional - Real-time chat
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER=""
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with Next.js and deployed on Netlify
