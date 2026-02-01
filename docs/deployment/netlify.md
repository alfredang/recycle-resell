# Deploy to Netlify

This guide explains how to deploy ReResell to Netlify.

## Prerequisites

- A [Netlify](https://netlify.com) account
- Your code pushed to GitHub
- A Neon PostgreSQL database

## Step 1: Connect Repository

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize Netlify
4. Choose the `recycle-resell` repository

## Step 2: Configure Build Settings

Netlify should auto-detect Next.js. Verify these settings:

| Setting | Value |
|---------|-------|
| Base directory | (leave empty) |
| Build command | `npm run build` |
| Publish directory | `.next` |

## Step 3: Add Environment Variables

Go to **Site settings** → **Environment variables** and add:

### Required Variables

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-site.netlify.app
```

### Optional Variables

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster
```

## Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at `https://your-site.netlify.app`

## Step 5: Update NEXTAUTH_URL

After the first deploy:

1. Copy your Netlify site URL
2. Update the `NEXTAUTH_URL` environment variable
3. Trigger a redeploy: **Deploys** → **Trigger deploy**

## Custom Domain

To use a custom domain:

1. Go to **Domain management**
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

### Build Fails

Check the deploy logs for errors. Common issues:

- Missing environment variables
- TypeScript errors
- Dependency issues

### Database Connection Issues

Ensure your Neon database:

- Is accessible from Netlify's IP addresses
- Has the correct SSL mode (`sslmode=require`)
- Credentials are correct

### Authentication Not Working

Verify:

- `NEXTAUTH_URL` matches your deployed URL exactly
- `NEXTAUTH_SECRET` is set
- Google OAuth redirect URIs include your Netlify URL

## Auto-Deploy

By default, Netlify auto-deploys when you push to the `main` branch. You can:

- Lock deploys to prevent auto-deploy
- Set up deploy previews for pull requests
- Configure deploy notifications
