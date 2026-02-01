# Configuration

This guide explains all the environment variables used by ReResell.

## Required Variables

### Database

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

The PostgreSQL connection string. We recommend using [Neon](https://neon.tech) for serverless PostgreSQL.

### Authentication

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

- `NEXTAUTH_URL`: Your application URL (use `http://localhost:3000` for development)
- `NEXTAUTH_SECRET`: A random string for encrypting tokens. Generate with:

```bash
openssl rand -base64 32
```

## Optional Variables

### Google OAuth

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

### Image Storage (Vercel Blob)

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

For image uploads:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Storage → Create Database → Blob
3. Copy the `BLOB_READ_WRITE_TOKEN`

### Real-time Chat (Pusher)

```env
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="us2"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
```

For real-time messaging:

1. Create an account at [Pusher](https://pusher.com)
2. Create a new Channels app
3. Copy the credentials from App Keys

## Environment File Example

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:xxx@ep-xxx.neon.tech/neondb?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Pusher (optional)
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER=""
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""

# Vercel Blob Storage (optional)
BLOB_READ_WRITE_TOKEN=""
```

## Production Considerations

!!! warning "Security"
    Never commit your `.env` file to version control. It's already in `.gitignore`.

For production deployments:

1. Use strong, randomly generated secrets
2. Update `NEXTAUTH_URL` to your production domain
3. Update Google OAuth redirect URIs
4. Consider using environment variable encryption
