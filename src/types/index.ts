import type {
  User,
  Listing,
  ListingImage,
  Category,
  Conversation,
  Message,
  Offer,
  Review,
  Favorite,
  Transaction,
  Notification,
} from "@prisma/client"

// Extended types with relations
export type UserWithRelations = User & {
  listings?: Listing[]
  favorites?: Favorite[]
  reviewsReceived?: Review[]
  _count?: {
    listings: number
    reviewsReceived: number
    salesTransactions: number
  }
}

export type ListingWithRelations = Listing & {
  images: ListingImage[]
  seller: Pick<User, "id" | "name" | "image" | "isVerified">
  category: Pick<Category, "id" | "name" | "slug">
  _count?: {
    favorites: number
  }
  isFavorited?: boolean
}

export type ListingCardData = Pick<
  Listing,
  "id" | "title" | "slug" | "condition" | "status" | "location"
> & {
  price: string
  createdAt: string
  images: Pick<ListingImage, "url">[]
  seller: Pick<User, "id" | "name" | "image">
  isFavorited?: boolean
  likeCount: number
}

export type ConversationWithRelations = Conversation & {
  buyer: Pick<User, "id" | "name" | "image">
  seller: Pick<User, "id" | "name" | "image">
  listing: Pick<Listing, "id" | "title" | "price" | "status"> & {
    images: Pick<ListingImage, "url">[]
  }
  messages: Message[]
  _count?: {
    messages: number
  }
}

export type MessageWithSender = Message & {
  sender: Pick<User, "id" | "name" | "image">
}

export type OfferWithRelations = Offer & {
  buyer: Pick<User, "id" | "name" | "image">
  seller: Pick<User, "id" | "name" | "image">
  listing: Pick<Listing, "id" | "title" | "price"> & {
    images: Pick<ListingImage, "url">[]
  }
}

export type ReviewWithAuthor = Review & {
  author: Pick<User, "id" | "name" | "image">
}

export type CategoryWithCount = Category & {
  _count: {
    listings: number
  }
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

// Search & Filter types
export interface ListingFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string[]
  location?: string
  status?: string
  sellerId?: string
}

export interface ListingSort {
  field: "createdAt" | "price" | "likeCount"
  direction: "asc" | "desc"
}

export interface SearchParams {
  query?: string
  filters?: ListingFilters
  sort?: ListingSort
  page?: number
  limit?: number
}

// Form types
export interface CreateListingInput {
  title: string
  description: string
  price: number
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR"
  categoryId: string
  location: string
  brand?: string
  tags?: string[]
  meetupOnly?: boolean
  canDeliver?: boolean
  deliveryFee?: number
  images: { url: string; key: string }[]
}

export interface UpdateListingInput extends Partial<CreateListingInput> {
  status?: "DRAFT" | "AVAILABLE" | "RESERVED" | "SOLD"
}

export interface CreateOfferInput {
  listingId: string
  amount: number
  message?: string
}

export interface CreateReviewInput {
  transactionId: string
  targetId: string
  rating: number
  comment?: string
}

// Re-export Prisma types
export type {
  User,
  Listing,
  ListingImage,
  Category,
  Conversation,
  Message,
  Offer,
  Review,
  Favorite,
  Transaction,
  Notification,
}
