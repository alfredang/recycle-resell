import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Header, MobileNav } from "@/components/layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "ReResell - Buy & Sell Second-hand Items",
    template: "%s | ReResell",
  },
  description:
    "The marketplace for buying and selling pre-loved items. Find great deals on electronics, fashion, home goods, and more.",
  keywords: [
    "marketplace",
    "buy",
    "sell",
    "second-hand",
    "pre-loved",
    "used items",
    "electronics",
    "fashion",
  ],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}
