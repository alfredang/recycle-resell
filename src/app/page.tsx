import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ListingGrid } from "@/components/listings"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: 8,
  })
}

async function getListings(userId?: string) {
  const listings = await prisma.listing.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      images: {
        select: { url: true },
        orderBy: { order: "asc" },
        take: 1,
      },
      seller: {
        select: { id: true, name: true, image: true },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  })

  return listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    slug: listing.slug,
    price: listing.price.toString(),
    condition: listing.condition,
    status: listing.status,
    location: listing.location,
    createdAt: listing.createdAt.toISOString(),
    likeCount: listing.likeCount,
    images: listing.images,
    seller: listing.seller,
    isFavorited: Array.isArray(listing.favorites) && listing.favorites.length > 0,
  }))
}

const categoryIcons: Record<string, string> = {
  electronics: "laptop",
  fashion: "shirt",
  home: "home",
  sports: "dumbbell",
  books: "book-open",
  vehicles: "car",
  services: "briefcase",
  others: "package",
}

export default async function HomePage() {
  const session = await auth()
  const [categories, listings] = await Promise.all([
    getCategories(),
    getListings(session?.user?.id),
  ])

  return (
    <div className="container py-6 space-y-8">
      {/* Hero Section */}
      <section className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-10">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Buy and sell pre-loved items
          </h1>
          <p className="text-muted-foreground">
            Join thousands of users buying and selling electronics, fashion, home goods and more.
            Give items a second life while saving money.
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/listing/create">Start selling</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/search">Browse listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Browse Categories</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/categories" className="gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">{category.icon || "📦"}</span>
              </div>
              <span className="text-xs text-center font-medium line-clamp-1">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Listings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Listings</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/search?sort=recent" className="gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ListingGrid
          listings={listings}
          emptyMessage="No listings yet. Be the first to sell something!"
        />
      </section>
    </div>
  )
}
