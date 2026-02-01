"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn, formatPrice, formatRelativeTime, conditionLabels, conditionColors } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ListingCardData } from "@/types"

interface ListingCardProps {
  listing: ListingCardData
  onFavoriteToggle?: (listingId: string, isFavorited: boolean) => void
}

export function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(listing.isFavorited ?? false)
  const [isLoading, setIsLoading] = useState(false)

  const primaryImage = listing.images[0]?.url || "/placeholder-image.jpg"

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const method = isFavorited ? "DELETE" : "POST"
      const url = isFavorited
        ? `/api/favorites/${listing.id}`
        : "/api/favorites"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({ listingId: listing.id }) : undefined,
      })

      if (!response.ok) throw new Error()

      setIsFavorited(!isFavorited)
      onFavoriteToggle?.(listing.id, !isFavorited)
      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={primaryImage}
          alt={listing.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white",
            isFavorited && "text-red-500"
          )}
          onClick={handleFavoriteClick}
          disabled={isLoading}
        >
          <Heart
            className={cn("h-4 w-4", isFavorited && "fill-current")}
          />
        </Button>

        {/* Status Badge */}
        {listing.status !== "AVAILABLE" && (
          <Badge
            variant="secondary"
            className="absolute bottom-2 left-2 bg-black/70 text-white"
          >
            {listing.status === "RESERVED" ? "Reserved" : "Sold"}
          </Badge>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-lg leading-tight line-clamp-1">
            {formatPrice(listing.price)}
          </p>
          <Badge
            variant="secondary"
            className={cn("text-xs shrink-0", conditionColors[listing.condition])}
          >
            {conditionLabels[listing.condition]}
          </Badge>
        </div>

        <h3 className="text-sm line-clamp-2 text-muted-foreground">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{listing.location}</span>
          <span>{formatRelativeTime(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
