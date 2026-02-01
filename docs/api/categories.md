# Categories API

Endpoints for retrieving marketplace categories.

## List Categories

Retrieve all active categories.

```
GET /api/categories
```

### Response

```json
[
  {
    "id": "clm...",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Phones, laptops, tablets, and other electronic devices",
    "icon": "laptop",
    "parentId": null,
    "order": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "_count": {
      "listings": 25
    }
  },
  {
    "id": "clm...",
    "name": "Fashion",
    "slug": "fashion",
    "description": "Clothing, shoes, bags, and accessories",
    "icon": "shirt",
    "parentId": null,
    "order": 2,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "_count": {
      "listings": 42
    }
  }
]
```

## Default Categories

The database is seeded with these categories:

| Name | Slug | Icon |
|------|------|------|
| Electronics | electronics | laptop |
| Fashion | fashion | shirt |
| Home & Living | home-living | home |
| Sports | sports | dumbbell |
| Books | books | book-open |
| Vehicles | vehicles | car |
| Services | services | briefcase |
| Others | others | package |

## Category Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `slug` | string | URL-friendly identifier |
| `description` | string | Category description |
| `icon` | string | Icon name or emoji |
| `parentId` | string? | Parent category ID (for subcategories) |
| `order` | number | Display order |
| `isActive` | boolean | Whether category is active |
| `_count.listings` | number | Number of listings in category |
