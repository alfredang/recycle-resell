import { Suspense } from "react"
import type { Metadata } from "next"
import { SearchResults } from "./search-results"
import { SearchFilters } from "./search-filters"
import { ListingSkeleton } from "@/components/listings"

export const metadata: Metadata = {
  title: "Search",
  description: "Search for items on ReResell",
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    condition?: string
    location?: string
    sort?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="container py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <SearchFilters />
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ListingSkeleton key={i} />
                ))}
              </div>
            }
          >
            <SearchResults searchParams={params} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
