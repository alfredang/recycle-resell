import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ listingId: string }>
}

// DELETE /api/favorites/[listingId] - Remove from favorites
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { listingId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
    })

    if (!favorite) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    })

    // Decrement like count
    await prisma.listing.update({
      where: { id: listingId },
      data: { likeCount: { decrement: 1 } },
    })

    return NextResponse.json({ message: "Removed from favorites" })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
