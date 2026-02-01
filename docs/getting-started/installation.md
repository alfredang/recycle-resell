# Installation

This guide will help you set up ReResell on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

You'll also need:

- A PostgreSQL database (we recommend [Neon](https://neon.tech) for serverless PostgreSQL)
- A [Vercel](https://vercel.com) account (optional, for image uploads)
- A [Pusher](https://pusher.com) account (optional, for real-time chat)

## Step 1: Clone the Repository

```bash
git clone https://github.com/alfredang/recycle-resell.git
cd recycle-resell
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- Next.js and React
- Prisma ORM
- NextAuth.js
- Tailwind CSS and shadcn/ui components
- And other supporting libraries

## Step 3: Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials. See the [Configuration](configuration.md) guide for details on each variable.

## Step 4: Set Up the Database

### Using Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env` file

### Push the Schema

```bash
npm run db:push
```

This creates all the necessary database tables.

### Seed Sample Data

```bash
npm run db:seed
```

This populates the database with:

- 8 categories
- 3 test users
- 10 sample listings

## Step 5: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Database Connection Issues

If you see connection errors:

1. Verify your `DATABASE_URL` is correct
2. Ensure your database allows connections from your IP
3. Check that SSL mode is set correctly (`?sslmode=require`)

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

## Next Steps

- [Configure environment variables](configuration.md)
- [Learn about the features](../features/authentication.md)
- [Deploy your app](../deployment/netlify.md)
