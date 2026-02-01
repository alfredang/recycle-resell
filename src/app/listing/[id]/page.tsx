import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import {
  formatPrice,
  formatRelativeTime,
  formatDate,
  conditionLabels,
  conditionColors,
  statusLabels,
} from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Eye,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { ListingActions } from "./listing-actions"
import { ImageGallery } from "./image-gallery"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getListing(id: string, userId?: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          isVerified: true,
          createdAt: true,
          location: true,
        },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  })

  if (!listing) return null

  // Get seller stats
  const [sellerRating, listingCount] = await Promise.all([
    prisma.review.aggregate({
      where: { targetId: listing.sellerId },
      _avg: { rating: true },
      _count: true,
    }),
    prisma.listing.count({
      where: { sellerId: listing.sellerId, status: "AVAILABLE" },
    }),
  ])

  // Increment view count
  prisma.listing
    .update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {})

  return {
    ...listing,
    price: listing.price.toString(),
    deliveryFee: listing.deliveryFee?.toString(),
    isFavorited: Array.isArray(listing.favorites) && listing.favorites.length > 0,
    seller: {
      ...listing.seller,
      averageRating: sellerRating._avg.rating,
      reviewCount: sellerRating._count,
      listingCount,
    },
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { title: true, description: true, images: { take: 1, select: { url: true } } },
  })

  if (!listing) return { title: "Listing Not Found" }

  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.images[0]?.url ? [listing.images[0].url] : [],
    },
  }
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const listing = await getListing(id, session?.user?.id)

  if (!listing) notFound()

  const isOwner = session?.user?.id === listing.sellerId

  return (
    <div className="container max-w-6xl py-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ImageGallery images={listing.images} title={listing.title} />

        {/* Listing Details */}
        <div className="space-y-6">
          {/* Price and Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(listing.price)}
              </span>
              {listing.status !== "AVAILABLE" && (
                <Badge variant="secondary" className="text-sm">
                  {statusLabels[listing.status]}
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-semibold">{listing.title}</h1>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={conditionColors[listing.condition]}>
              {conditionLabels[listing.condition]}
            </Badge>
            <Badge variant="outline">
              <MapPin className="h-3 w-3 mr-1" />
              {listing.location}
            </Badge>
            {listing.brand && (
              <Badge variant="outline">{listing.brand}</Badge>
            )}
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/categories/${listing.category.slug}`}
              className="hover:underline"
            >
              {listing.category.name}
            </Link>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h2 className="font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Shipping Info */}
          <div className="space-y-2">
            <h2 className="font-semibold">Delivery Options</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              {listing.meetupOnly && <p>Meetup available</p>}
              {listing.canDeliver && (
                <p>
                  Delivery available{" "}
                  {listing.deliveryFee && `(+${formatPrice(listing.deliveryFee)})`}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <div className="space-y-4">
            <h2 className="font-semibold">Seller</h2>
            <Link
              href={`/user/${listing.seller.id}`}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <Avatar className="h-14 w-14">
                <AvatarImage src={listing.seller.image || undefined} />
                <AvatarFallback>
                  {listing.seller.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {listing.seller.name || "User"}
                  </span>
                  {listing.seller.isVerified && (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {listing.seller.averageRating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {listing.seller.averageRating.toFixed(1)} ({listing.seller.reviewCount})
                    </span>
                  )}
                  <span>{listing.seller.listingCount} listings</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>

          {/* Actions */}
          {!isOwner && listing.status === "AVAILABLE" && (
            <ListingActions
              listingId={listing.id}
              sellerId={listing.sellerId}
              isFavorited={listing.isFavorited}
            />
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href={`/listings/${listing.id}/edit`}>Edit Listing</Link>
              </Button>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Listed {formatRelativeTime(listing.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {listing.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {listing.likeCount} likes
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
