import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ListingGrid } from "@/components/listings"

interface SearchResultsProps {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    condition?: string
    location?: string
    sort?: string
    page?: string
  }
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const session = await auth()
  const {
    q: query,
    category,
    minPrice,
    maxPrice,
    condition,
    location,
    sort = "recent",
    page = "1",
  } = searchParams

  const currentPage = parseInt(page) || 1
  const limit = 20
  const skip = (currentPage - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {
    status: "AVAILABLE",
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { brand: { contains: query, mode: "insensitive" } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
  }

  if (condition) {
    const conditions = condition.split(",")
    where.condition = { in: conditions }
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" }
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: "desc" }
  if (sort === "price-low") orderBy = { price: "asc" }
  else if (sort === "price-high") orderBy = { price: "desc" }
  else if (sort === "popular") orderBy = { likeCount: "desc" }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: {
          select: { url: true },
          orderBy: { order: "asc" },
          take: 1,
        },
        seller: {
          select: { id: true, name: true, image: true },
        },
        favorites: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : false,
      },
    }),
    prisma.listing.count({ where }),
  ])

  const data = listings.map((listing) => ({
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

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "result" : "results"}
          {query && ` for "${query}"`}
        </p>
      </div>

      {/* Results Grid */}
      <ListingGrid
        listings={data}
        emptyMessage={
          query
            ? `No results found for "${query}"`
            : "No listings match your filters"
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1
            const isActive = pageNum === currentPage
            const searchParamsObj = new URLSearchParams()
            Object.entries(searchParams).forEach(([key, value]) => {
              if (value && key !== "page") searchParamsObj.set(key, value)
            })
            searchParamsObj.set("page", pageNum.toString())

            return (
              <a
                key={pageNum}
                href={`/search?${searchParamsObj.toString()}`}
                className={`px-3 py-1 rounded text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                }`}
              >
                {pageNum}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
