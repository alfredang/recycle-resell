# Listings API

Endpoints for managing marketplace listings.

## List Listings

Retrieve a paginated list of listings with optional filters.

```
GET /api/listings
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query for title, description, brand |
| `category` | string | Category slug to filter by |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `condition` | string | Condition filter (comma-separated) |
| `location` | string | Location filter |
| `sort` | string | Sort order: `recent`, `price-low`, `price-high`, `popular` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 50) |

### Response

```json
{
  "data": [
    {
      "id": "clm...",
      "title": "iPhone 14 Pro",
      "slug": "iphone-14-pro",
      "price": "999",
      "condition": "LIKE_NEW",
      "status": "AVAILABLE",
      "location": "Singapore",
      "createdAt": "2024-01-15T10:30:00Z",
      "likeCount": 5,
      "images": [{ "url": "https://..." }],
      "seller": {
        "id": "clm...",
        "name": "John Doe",
        "image": null
      },
      "isFavorited": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Create Listing

Create a new listing. Requires authentication.

```
POST /api/listings
```

### Request Body

```json
{
  "title": "iPhone 14 Pro",
  "description": "Like new condition, barely used...",
  "price": 999,
  "condition": "LIKE_NEW",
  "categoryId": "clm...",
  "location": "Singapore",
  "brand": "Apple",
  "tags": ["phone", "apple"],
  "meetupOnly": true,
  "canDeliver": false,
  "deliveryFee": 0,
  "images": [
    { "url": "https://...", "key": "abc123" }
  ]
}
```

### Condition Values

- `NEW` - Brand new, unused
- `LIKE_NEW` - Excellent condition, barely used
- `GOOD` - Good condition, minor wear
- `FAIR` - Fair condition, visible wear
- `POOR` - Poor condition, significant wear

### Response

Returns the created listing with `201 Created` status.

## Get Listing

Retrieve a single listing by ID.

```
GET /api/listings/[id]
```

### Response

```json
{
  "id": "clm...",
  "title": "iPhone 14 Pro",
  "description": "Like new condition...",
  "price": "999",
  "condition": "LIKE_NEW",
  "status": "AVAILABLE",
  "location": "Singapore",
  "brand": "Apple",
  "viewCount": 150,
  "likeCount": 5,
  "createdAt": "2024-01-15T10:30:00Z",
  "images": [
    { "id": "...", "url": "https://...", "order": 0 }
  ],
  "seller": {
    "id": "...",
    "name": "John Doe",
    "image": null,
    "isVerified": true
  },
  "category": {
    "id": "...",
    "name": "Electronics",
    "slug": "electronics"
  },
  "isFavorited": false
}
```

## Update Listing

Update an existing listing. Requires authentication and ownership.

```
PUT /api/listings/[id]
```

### Request Body

Same as create, all fields optional.

## Delete Listing

Delete a listing. Requires authentication and ownership.

```
DELETE /api/listings/[id]
```

### Response

```json
{
  "message": "Listing deleted successfully"
}
```
