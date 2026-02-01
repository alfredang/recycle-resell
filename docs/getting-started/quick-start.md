# Quick Start

Get ReResell running in under 5 minutes.

## Prerequisites

- Node.js 18+
- A Neon PostgreSQL database

## Steps

### 1. Clone and Install

```bash
git clone https://github.com/alfredang/recycle-resell.git
cd recycle-resell
npm install
```

### 2. Configure Environment

Create `.env` file with minimum required variables:

```env
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-for-development"
```

### 3. Set Up Database

```bash
npm run db:push
npm run db:seed
```

### 4. Start the App

```bash
npm run dev
```

### 5. Open in Browser

Visit [http://localhost:3000](http://localhost:3000)

### 6. Log In

Use a test account:

- Email: `alice@example.com`
- Password: `password123`

## What's Next?

- Browse listings on the homepage
- Try the search with filters
- Create a new listing
- Add items to favorites

## Need Help?

- [Full Installation Guide](installation.md)
- [Configuration Reference](configuration.md)
- [GitHub Issues](https://github.com/alfredang/recycle-resell/issues)
