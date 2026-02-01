# Environment Variables

Complete reference for all environment variables used by ReResell.

## Required Variables

These variables must be set for the application to work.

### `DATABASE_URL`

PostgreSQL connection string.

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`

**Providers:**

- [Neon](https://neon.tech) (recommended)
- [Supabase](https://supabase.com)
- [PlanetScale](https://planetscale.com)
- Any PostgreSQL provider

### `NEXTAUTH_URL`

The canonical URL of your application.

```env
# Development
NEXTAUTH_URL="http://localhost:3000"

# Production
NEXTAUTH_URL="https://your-domain.com"
```

!!! warning "Important"
    Must match your deployed URL exactly, including protocol (https).

### `NEXTAUTH_SECRET`

Secret key for encrypting tokens and cookies.

```env
NEXTAUTH_SECRET="your-super-secret-key-here"
```

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

## Optional Variables

### Google OAuth

Enable "Sign in with Google" functionality.

```env
GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxx"
```

**Setup:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`

### Vercel Blob Storage

Enable image uploads.

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxxxxxxxxxx"
```

**Setup:**

1. Create a Blob store in Vercel dashboard
2. Copy the read/write token

### Pusher (Real-time Chat)

Enable real-time messaging features.

```env
# Server-side
PUSHER_APP_ID="1234567"
PUSHER_KEY="abcdefghijk"
PUSHER_SECRET="xxxxxxxxxxxxx"
PUSHER_CLUSTER="us2"

# Client-side (exposed to browser)
NEXT_PUBLIC_PUSHER_KEY="abcdefghijk"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
```

**Setup:**

1. Create account at [Pusher](https://pusher.com)
2. Create a Channels app
3. Copy credentials from App Keys

## Environment by Platform

### Local Development

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret"
```

### Netlify

Add variables in **Site settings** → **Environment variables**.

### Vercel

Add variables in **Project Settings** → **Environment Variables**.

### Docker

Pass variables via `docker run -e` or `docker-compose.yml`:

```yaml
environment:
  - DATABASE_URL=${DATABASE_URL}
  - NEXTAUTH_URL=${NEXTAUTH_URL}
  - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets** periodically
4. **Limit access** to production environment variables
5. **Use secret managers** for sensitive data in production
