import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { favoriteSchema } from "@/lib/validations"

// GET /api/favorites - Get user's favorites
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          include: {
            images: {
              select: { url: true },
              orderBy: { order: "asc" },
              take: 1,
            },
            seller: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    })

    const data = favorites.map((fav) => ({
      id: fav.listing.id,
      title: fav.listing.title,
      slug: fav.listing.slug,
      price: fav.listing.price.toString(),
      condition: fav.listing.condition,
      status: fav.listing.status,
      location: fav.listing.location,
      createdAt: fav.listing.createdAt.toISOString(),
      likeCount: fav.listing.likeCount,
      images: fav.listing.images,
      seller: fav.listing.seller,
      isFavorited: true,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add to favorites
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = favoriteSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { listingId } = validatedData.data

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, sellerId: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Can't favorite own listing
    if (listing.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot favorite your own listing" },
        { status: 400 }
      )
    }

    // Create favorite (upsert to handle duplicates)
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        listingId,
      },
    })

    // Increment like count
    await prisma.listing.update({
      where: { id: listingId },
      data: { likeCount: { increment: 1 } },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
