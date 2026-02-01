# Authentication API

Endpoints for user authentication.

## Register

Create a new user account.

```
POST /api/auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Required, min 2 characters |
| `email` | Required, valid email format |
| `password` | Required, min 6 characters |

### Response

**Success (201 Created)**

```json
{
  "message": "User created successfully"
}
```

**Error (400 Bad Request)**

```json
{
  "error": "User already exists"
}
```

## Sign In

Authentication is handled by NextAuth.js. Use the built-in sign-in methods.

### Email/Password

```
POST /api/auth/callback/credentials
```

This is automatically handled by the NextAuth.js login form.

### Google OAuth

Redirect users to:

```
GET /api/auth/signin/google
```

## Sign Out

```
POST /api/auth/signout
```

Or use the NextAuth.js `signOut()` function.

## Get Session

Check the current user's session.

```
GET /api/auth/session
```

### Response (Authenticated)

```json
{
  "user": {
    "id": "clm...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": null
  },
  "expires": "2024-02-15T10:30:00Z"
}
```

### Response (Not Authenticated)

```json
{}
```

## Using NextAuth.js Client

In your React components:

```tsx
import { useSession, signIn, signOut } from "next-auth/react"

function Component() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return <button onClick={() => signIn()}>Sign in</button>
}
```

## Protected Routes

Routes under `/dashboard`, `/favorites`, `/chat`, etc. require authentication. Unauthenticated users are redirected to `/login`.
