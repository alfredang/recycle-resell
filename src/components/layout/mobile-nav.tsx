"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
  {
    label: "Sell",
    href: "/listing/create",
    icon: PlusCircle,
    requiresAuth: true,
  },
  {
    label: "Chat",
    href: "/chat",
    icon: MessageCircle,
    requiresAuth: true,
  },
  {
    label: "Profile",
    href: "/dashboard",
    icon: User,
    requiresAuth: true,
    guestHref: "/login",
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const href =
            item.requiresAuth && !session?.user
              ? item.guestHref || "/login"
              : item.href

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  item.label === "Sell" && "h-6 w-6 text-primary"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  item.label === "Sell" && "text-primary"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* Safe area padding for phones with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
