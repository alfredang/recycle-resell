import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createListingSchema, searchParamsSchema } from "@/lib/validations"
import { generateSlug } from "@/lib/utils"

// GET /api/listings - List all listings with pagination and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()

    const params = searchParamsSchema.parse({
      query: searchParams.get("query"),
      category: searchParams.get("category"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      condition: searchParams.get("condition"),
      location: searchParams.get("location"),
      sort: searchParams.get("sort"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    })

    const { page, limit, query, category, minPrice, maxPrice, condition, location, sort } = params
    const skip = (page - 1) * limit

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

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice
      if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice
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

    // Execute query
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

    // Transform response
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

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/listings - Create new listing
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createListingSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { images, ...listingData } = validatedData.data

    // Generate unique slug
    let slug = generateSlug(listingData.title)
    const existingSlug = await prisma.listing.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        slug,
        sellerId: session.user.id,
        publishedAt: new Date(),
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            key: img.key,
            order: index,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        images: true,
        seller: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
