"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ListingActionsProps {
  listingId: string
  sellerId: string
  isFavorited: boolean
}

export function ListingActions({
  listingId,
  sellerId,
  isFavorited: initialFavorited,
}: ListingActionsProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const handleChat = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }

    try {
      // Create or get existing conversation
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          message: "Hi, is this still available?",
        }),
      })

      if (!response.ok) throw new Error()

      const conversation = await response.json()
      router.push(`/chat/${conversation.id}`)
    } catch {
      toast.error("Failed to start conversation")
    }
  }

  const handleFavorite = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const method = isFavorited ? "DELETE" : "POST"
      const url = isFavorited
        ? `/api/favorites/${listingId}`
        : "/api/favorites"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({ listingId }) : undefined,
      })

      if (!response.ok) throw new Error()

      setIsFavorited(!isFavorited)
      toast.success(
        isFavorited ? "Removed from favorites" : "Added to favorites"
      )
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url,
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <div className="flex gap-3">
      <Button onClick={handleChat} className="flex-1 gap-2">
        <MessageCircle className="h-4 w-4" />
        Chat with Seller
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleFavorite}
        disabled={isLoading}
        className={cn(isFavorited && "text-red-500")}
      >
        <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
      </Button>

      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
