"use client"

import { ListingCard } from "./listing-card"
import { ListingSkeleton } from "./listing-skeleton"
import type { ListingCardData } from "@/types"

interface ListingGridProps {
  listings: ListingCardData[]
  isLoading?: boolean
  emptyMessage?: string
  onFavoriteToggle?: (listingId: string, isFavorited: boolean) => void
}

export function ListingGrid({
  listings,
  isLoading = false,
  emptyMessage = "No listings found",
  onFavoriteToggle,
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  )
}
