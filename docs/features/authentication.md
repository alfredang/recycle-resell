# Authentication

ReResell uses NextAuth.js v5 for secure authentication.

## Sign Up

Users can create an account with:

- **Email and Password** - Traditional registration
- **Google OAuth** - One-click sign up with Google

### Email Registration

1. Navigate to `/register`
2. Enter name, email, and password
3. Password must be at least 6 characters
4. Account is created immediately

### Google Sign Up

1. Click "Continue with Google"
2. Select your Google account
3. Account is created automatically

## Sign In

### Email Sign In

1. Navigate to `/login`
2. Enter email and password
3. Redirected to homepage on success

### Google Sign In

1. Click "Continue with Google"
2. Select your Google account
3. Redirected to homepage on success

## Protected Routes

These routes require authentication:

| Route | Description |
|-------|-------------|
| `/dashboard` | User dashboard |
| `/listing/create` | Create new listing |
| `/favorites` | Saved listings |
| `/chat` | Messages |
| `/profile` | Edit profile |
| `/offers` | Sent/received offers |

Unauthenticated users are redirected to `/login` with a callback URL.

## Session Management

- Sessions use JWT tokens stored in HTTP-only cookies
- Sessions expire after 30 days
- Users can sign out from the header menu

## User Profile

After authentication, users have access to:

- **Name** - Display name
- **Email** - Login email (cannot be changed)
- **Profile Image** - From Google or uploaded
- **Bio** - Optional description
- **Location** - Default meetup location

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **CSRF Protection** - Built into NextAuth.js
- **Secure Cookies** - HTTP-only, secure in production
- **OAuth State** - Prevents CSRF on OAuth flows

## Implementing Auth in Components

```tsx
// Check auth status
import { useSession } from "next-auth/react"

function Component() {
  const { data: session, status } = useSession()

  if (status === "loading") return <Loading />
  if (!session) return <SignInPrompt />

  return <AuthenticatedContent user={session.user} />
}
```

```tsx
// Server component
import { auth } from "@/lib/auth"

async function Page() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return <Content />
}
```
