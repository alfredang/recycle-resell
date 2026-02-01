# Search & Filters

Find items quickly with powerful search and filtering.

## Search

### Basic Search

1. Use the search bar in the header
2. Enter keywords (title, description, brand)
3. Press Enter or click search

### Search Tips

- Use specific terms: "MacBook Pro M2" vs "laptop"
- Include brand names for better results
- Try different keywords if no results

## Filters

Access filters on the `/search` page.

### Category Filter

Filter by category:

- Electronics
- Fashion
- Home & Living
- Sports
- Books
- Vehicles
- Services
- Others

### Price Range

Set minimum and/or maximum price:

- Min: 0+
- Max: Any amount
- Leave empty for no limit

### Condition

Filter by item condition:

- New
- Like New
- Good
- Fair
- Poor

Multiple conditions can be selected.

### Location

Filter by seller's meetup location.

## Sorting

Sort results by:

| Option | Description |
|--------|-------------|
| Most Recent | Newest listings first |
| Price: Low to High | Cheapest first |
| Price: High to Low | Most expensive first |
| Most Popular | Most likes first |

## URL Parameters

Search state is reflected in the URL:

```
/search?q=iphone&category=electronics&minPrice=100&maxPrice=500&condition=LIKE_NEW&sort=price-low
```

Parameters:

| Parameter | Description |
|-----------|-------------|
| `q` | Search query |
| `category` | Category slug |
| `minPrice` | Minimum price |
| `maxPrice` | Maximum price |
| `condition` | Condition filter |
| `sort` | Sort order |
| `page` | Page number |

## Mobile Experience

On mobile devices:

1. Tap the filter button
2. Filters open in a slide-out sheet
3. Set your filters
4. Tap "Apply Filters"

## Pagination

- 20 listings per page by default
- Navigate with page numbers
- Infinite scroll on mobile

## No Results

If no listings match your search:

- Try broader search terms
- Remove some filters
- Check spelling
- Browse categories instead
