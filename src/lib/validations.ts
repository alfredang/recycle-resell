import { z } from "zod"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// User schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  image: z.string().url().optional(),
})

// Listing schemas
export const listingImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  key: z.string().min(1, "Image key is required"),
})

export const createListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description must be less than 5000 characters"),
  price: z.number().min(0, "Price must be positive").max(1000000, "Price must be less than 1,000,000"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  categoryId: z.string().cuid("Invalid category"),
  location: z.string().min(2, "Location is required"),
  brand: z.string().max(100).optional(),
  tags: z.array(z.string()).max(10).optional(),
  meetupOnly: z.boolean().optional(),
  canDeliver: z.boolean().optional(),
  deliveryFee: z.number().min(0).optional(),
  images: z.array(listingImageSchema).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
})

export const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(["DRAFT", "AVAILABLE", "RESERVED", "SOLD"]).optional(),
})

export const listingStatusSchema = z.object({
  status: z.enum(["DRAFT", "AVAILABLE", "RESERVED", "SOLD"]),
})

// Helper to convert null to undefined
const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === null ? undefined : val), schema)

// Search schemas
export const searchParamsSchema = z.object({
  query: nullToUndefined(z.string().optional()),
  category: nullToUndefined(z.string().optional()),
  minPrice: nullToUndefined(z.coerce.number().min(0).optional()),
  maxPrice: nullToUndefined(z.coerce.number().min(0).optional()),
  condition: nullToUndefined(z.string().optional()), // comma-separated values
  location: nullToUndefined(z.string().optional()),
  sort: nullToUndefined(z.enum(["recent", "price-low", "price-high", "popular"]).default("recent")),
  page: nullToUndefined(z.coerce.number().min(1).default(1)),
  limit: nullToUndefined(z.coerce.number().min(1).max(50).default(20)),
})

// Chat schemas
export const createConversationSchema = z.object({
  listingId: z.string().cuid("Invalid listing"),
  message: z.string().min(1, "Message is required").max(1000),
})

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message is required").max(1000),
  imageUrl: z.string().url().optional(),
})

// Offer schemas
export const createOfferSchema = z.object({
  listingId: z.string().cuid("Invalid listing"),
  amount: z.number().min(0.01, "Offer must be at least 0.01"),
  message: z.string().max(500).optional(),
})

export const respondOfferSchema = z.object({
  action: z.enum(["accept", "reject", "withdraw"]),
})

// Review schemas
export const createReviewSchema = z.object({
  transactionId: z.string().cuid("Invalid transaction"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(1000, "Comment must be less than 1000 characters").optional(),
})

// Favorite schemas
export const favoriteSchema = z.object({
  listingId: z.string().cuid("Invalid listing"),
})

// Type exports from schemas
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
export type SearchParamsInput = z.infer<typeof searchParamsSchema>
export type CreateConversationInput = z.infer<typeof createConversationSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type CreateOfferInput = z.infer<typeof createOfferSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
