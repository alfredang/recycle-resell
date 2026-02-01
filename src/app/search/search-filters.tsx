"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { conditionLabels } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
}

interface FilterFormProps {
  query: string
  setQuery: (v: string) => void
  category: string
  setCategory: (v: string) => void
  minPrice: string
  setMinPrice: (v: string) => void
  maxPrice: string
  setMaxPrice: (v: string) => void
  condition: string
  setCondition: (v: string) => void
  sort: string
  setSort: (v: string) => void
  categories: Category[]
  onApply: () => void
  onClear: () => void
  hasActiveFilters: boolean
}

const conditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]

function FilterForm({
  query,
  setQuery,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  condition,
  setCondition,
  sort,
  setSort,
  categories,
  onApply,
  onClear,
  hasActiveFilters,
}: FilterFormProps) {
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
          />
        </div>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label>Condition</Label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Any condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any condition</SelectItem>
            {conditions.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {conditionLabels[cond]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={onApply} className="flex-1">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Form state
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [condition, setCondition] = useState(searchParams.get("condition") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "recent")

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error)
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category && category !== "all") params.set("category", category)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (condition && condition !== "all") params.set("condition", condition)
    if (sort) params.set("sort", sort)

    router.push(`/search?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setQuery("")
    setCategory("")
    setMinPrice("")
    setMaxPrice("")
    setCondition("")
    setSort("recent")
    router.push("/search")
  }

  const hasActiveFilters =
    (category && category !== "all") || minPrice || maxPrice || (condition && condition !== "all") || sort !== "recent"

  const filterProps = {
    query,
    setQuery,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    condition,
    setCondition,
    sort,
    setSort,
    categories,
    onApply: applyFilters,
    onClear: clearFilters,
    hasActiveFilters,
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterForm {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-20 rounded-lg border p-4">
        <h2 className="font-semibold mb-4">Filters</h2>
        <FilterForm {...filterProps} />
      </div>
    </>
  )
}
