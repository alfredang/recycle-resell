# Deploy to Vercel

This guide explains how to deploy ReResell to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- Your code pushed to GitHub
- A Neon PostgreSQL database

## Step 1: Import Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import the `recycle-resell` repository

## Step 2: Configure Project

Vercel auto-detects Next.js settings. The defaults should work:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

## Step 3: Add Environment Variables

Add these environment variables before deploying:

### Required

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

### Optional

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `PUSHER_*` | Pusher credentials for real-time chat |

## Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Step 5: Set Up Vercel Blob (Optional)

For image uploads:

1. Go to your project in Vercel
2. Navigate to **Storage** tab
3. Click "Create" → "Blob"
4. Copy the token to `BLOB_READ_WRITE_TOKEN`
5. Redeploy

## Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records
4. Update `NEXTAUTH_URL` to the custom domain

## Preview Deployments

Vercel automatically creates preview deployments for pull requests. Note that:

- Each preview has a unique URL
- Preview URLs won't work with NextAuth unless configured
- Database changes affect production

## Production Checklist

- [ ] Environment variables are set
- [ ] `NEXTAUTH_URL` matches production URL
- [ ] Database is seeded
- [ ] Google OAuth URLs are configured
- [ ] Custom domain is set up (optional)

## Troubleshooting

### Function Timeout

If serverless functions timeout:

1. Check database connection
2. Optimize slow queries
3. Consider increasing timeout in `vercel.json`

### Image Upload Fails

Verify:

- Blob storage is created
- `BLOB_READ_WRITE_TOKEN` is set
- Token has read/write permissions

### Build Errors

Common fixes:

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```
