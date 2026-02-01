import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

// Edge-compatible auth config (no database adapter, no bcrypt)
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials provider will be added in the full auth.ts
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: () => null, // Placeholder - actual logic in auth.ts
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedRoutes = [
        "/dashboard",
        "/listings/create",
        "/listings/edit",
        "/favorites",
        "/chat",
        "/profile",
        "/offers",
        "/transactions",
      ]
      const authRoutes = ["/login", "/register"]

      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      )
      const isAuthRoute = authRoutes.includes(nextUrl.pathname)

      if (isProtectedRoute && !isLoggedIn) {
        return false // Will redirect to signIn page
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl.origin))
      }

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
}
