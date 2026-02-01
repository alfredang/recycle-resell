import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { RegisterForm } from "@/components/auth"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new ReResell account",
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">
          Start buying and selling today
        </p>
      </div>

      <Suspense fallback={<div className="h-[400px]" />}>
        <RegisterForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
