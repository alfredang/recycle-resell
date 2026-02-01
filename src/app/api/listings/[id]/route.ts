import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { updateListingSchema } from "@/lib/validations"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/listings/[id] - Get single listing
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            isVerified: true,
            createdAt: true,
            _count: {
              select: {
                listings: { where: { status: "AVAILABLE" } },
                reviewsReceived: true,
              },
            },
          },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        favorites: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : false,
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Increment view count (don't await)
    prisma.listing
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {})

    // Get seller's average rating
    const sellerRating = await prisma.review.aggregate({
      where: { targetId: listing.sellerId },
      _avg: { rating: true },
      _count: true,
    })

    return NextResponse.json({
      ...listing,
      price: listing.price.toString(),
      deliveryFee: listing.deliveryFee?.toString(),
      isFavorited: Array.isArray(listing.favorites) && listing.favorites.length > 0,
      seller: {
        ...listing.seller,
        averageRating: sellerRating._avg.rating,
        reviewCount: sellerRating._count,
      },
    })
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/listings/[id] - Update listing
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { sellerId: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateListingSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { images, ...updateData } = validatedData.data

    // Update listing
    const updated = await prisma.$transaction(async (tx) => {
      // If images are provided, replace them
      if (images) {
        await tx.listingImage.deleteMany({ where: { listingId: id } })
        await tx.listingImage.createMany({
          data: images.map((img, index) => ({
            listingId: id,
            url: img.url,
            key: img.key,
            order: index,
            isPrimary: index === 0,
          })),
        })
      }

      return tx.listing.update({
        where: { id },
        data: updateData,
        include: {
          images: { orderBy: { order: "asc" } },
          seller: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      })
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/listings/[id] - Delete listing (soft delete)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { sellerId: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.listing.update({
      where: { id },
      data: { status: "DELETED" },
    })

    return NextResponse.json({ message: "Listing deleted" })
  } catch (error) {
    console.error("Error deleting listing:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
