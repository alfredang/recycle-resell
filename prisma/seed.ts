import "dotenv/config"
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, ItemCondition } from "@prisma/client"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL!
console.log("Connecting to database...")

// Create a pool using standard pg
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Phones, laptops, tablets, and other electronic devices",
        icon: "📱",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing, shoes, bags, and accessories",
        icon: "👗",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-living" },
      update: {},
      create: {
        name: "Home & Living",
        slug: "home-living",
        description: "Furniture, decor, and household items",
        icon: "🏠",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: {
        name: "Sports",
        slug: "sports",
        description: "Sports equipment and outdoor gear",
        icon: "⚽",
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        name: "Books",
        slug: "books",
        description: "Books, magazines, and educational materials",
        icon: "📚",
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "vehicles" },
      update: {},
      create: {
        name: "Vehicles",
        slug: "vehicles",
        description: "Cars, motorcycles, and bicycles",
        icon: "🚗",
        order: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "services" },
      update: {},
      create: {
        name: "Services",
        slug: "services",
        description: "Professional and personal services",
        icon: "🔧",
        order: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "others" },
      update: {},
      create: {
        name: "Others",
        slug: "others",
        description: "Everything else",
        icon: "📦",
        order: 8,
      },
    }),
  ])

  console.log(`Created ${categories.length} categories`)

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        name: "Alice Chen",
        password: hashedPassword,
        bio: "Tech enthusiast and gadget collector. Based in Singapore.",
        location: "Orchard",
        isVerified: true,
        verifiedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        email: "bob@example.com",
        name: "Bob Tan",
        password: hashedPassword,
        bio: "Selling preloved items in good condition. Quick replies!",
        location: "Tampines",
      },
    }),
    prisma.user.upsert({
      where: { email: "carol@example.com" },
      update: {},
      create: {
        email: "carol@example.com",
        name: "Carol Lee",
        password: hashedPassword,
        bio: "Minimalist lifestyle advocate. Decluttering my home.",
        location: "Jurong East",
      },
    }),
  ])

  console.log(`Created ${users.length} users`)

  // Sample listing data
  const sampleListings = [
    {
      title: "iPhone 14 Pro Max 256GB - Space Black",
      description: "Selling my iPhone 14 Pro Max in excellent condition. Battery health at 95%. Comes with original box, cable, and a free case. No scratches or dents. Reason for selling: Upgraded to iPhone 15.",
      price: 1299,
      condition: "LIKE_NEW" as ItemCondition,
      categorySlug: "electronics",
      location: "Orchard MRT",
      brand: "Apple",
      sellerId: users[0].id,
      imageUrl: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800",
    },
    {
      title: "MacBook Pro 14\" M3 Pro - Brand New Sealed",
      description: "Brand new MacBook Pro 14 inch with M3 Pro chip. Still sealed in box. Bought but never used as I got a work laptop. Full Apple warranty.",
      price: 2899,
      condition: "NEW" as ItemCondition,
      categorySlug: "electronics",
      location: "Raffles Place",
      brand: "Apple",
      sellerId: users[0].id,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    },
    {
      title: "Sony WH-1000XM5 Wireless Headphones",
      description: "Premium noise-canceling headphones. Used for 6 months, excellent condition. Includes original case and accessories.",
      price: 320,
      condition: "GOOD" as ItemCondition,
      categorySlug: "electronics",
      location: "Bugis",
      brand: "Sony",
      sellerId: users[1].id,
      imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
    },
    {
      title: "Vintage Leather Jacket - Size M",
      description: "Genuine leather jacket from the 90s. Great vintage piece with beautiful patina. Size Medium, fits slim.",
      price: 180,
      condition: "GOOD" as ItemCondition,
      categorySlug: "fashion",
      location: "Tiong Bahru",
      brand: "Unknown",
      sellerId: users[1].id,
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    },
    {
      title: "Nike Air Jordan 1 Retro High - Size 9",
      description: "Classic Air Jordan 1s in Chicago colorway. Worn a few times, minimal creasing. Comes with original box.",
      price: 250,
      condition: "LIKE_NEW" as ItemCondition,
      categorySlug: "fashion",
      location: "Clementi",
      brand: "Nike",
      sellerId: users[2].id,
      imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800",
    },
    {
      title: "Herman Miller Aeron Chair - Size B",
      description: "Ergonomic office chair in excellent condition. Fully loaded with all adjustments. Selling as moving to smaller apartment.",
      price: 850,
      condition: "GOOD" as ItemCondition,
      categorySlug: "home-living",
      location: "Ang Mo Kio",
      brand: "Herman Miller",
      sellerId: users[2].id,
      imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
    },
    {
      title: "IKEA KALLAX Shelf Unit 4x4",
      description: "White KALLAX shelving unit, 147x147cm. Perfect for books or records. Some minor scratches. Self-collect only.",
      price: 80,
      condition: "FAIR" as ItemCondition,
      categorySlug: "home-living",
      location: "Woodlands",
      brand: "IKEA",
      sellerId: users[0].id,
      imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800",
    },
    {
      title: "Brompton M6L Folding Bike",
      description: "British-made folding bike in Turkish Green. 6-speed, perfect for commuting. Recently serviced.",
      price: 2200,
      condition: "GOOD" as ItemCondition,
      categorySlug: "vehicles",
      location: "Marina Bay",
      brand: "Brompton",
      sellerId: users[1].id,
      imageUrl: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800",
    },
    {
      title: "Complete Python Programming Books Set",
      description: "Set of 5 Python programming books including Python Crash Course, Automate the Boring Stuff, and more. Great for beginners.",
      price: 45,
      condition: "GOOD" as ItemCondition,
      categorySlug: "books",
      location: "NUS",
      sellerId: users[2].id,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    },
    {
      title: "Yoga Mat with Carrying Strap",
      description: "6mm thick yoga mat, non-slip surface. Lightly used, cleaned and sanitized. Perfect for home workouts.",
      price: 25,
      condition: "LIKE_NEW" as ItemCondition,
      categorySlug: "sports",
      location: "Bishan",
      sellerId: users[0].id,
      imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    },
  ]

  // Create listings
  for (const listing of sampleListings) {
    const category = categories.find((c) => c.slug === listing.categorySlug)
    if (!category) continue

    const slug = listing.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      + "-" + Date.now()

    await prisma.listing.create({
      data: {
        title: listing.title,
        slug,
        description: listing.description,
        price: listing.price,
        condition: listing.condition,
        location: listing.location,
        brand: listing.brand,
        status: "AVAILABLE",
        publishedAt: new Date(),
        sellerId: listing.sellerId,
        categoryId: category.id,
        images: {
          create: {
            url: listing.imageUrl,
            key: `seed-${Date.now()}-${Math.random()}`,
            order: 0,
            isPrimary: true,
          },
        },
      },
    })
  }

  console.log(`Created ${sampleListings.length} listings`)

  console.log("Seeding completed!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
