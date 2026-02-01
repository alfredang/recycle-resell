# Favorites API

Endpoints for managing user favorites (saved listings).

## Get Favorites

Retrieve the current user's favorited listings. Requires authentication.

```
GET /api/favorites
```

### Response

```json
[
  {
    "id": "clm...",
    "userId": "clm...",
    "listingId": "clm...",
    "createdAt": "2024-01-15T10:30:00Z",
    "listing": {
      "id": "clm...",
      "title": "iPhone 14 Pro",
      "slug": "iphone-14-pro",
      "price": "999",
      "condition": "LIKE_NEW",
      "status": "AVAILABLE",
      "location": "Singapore",
      "images": [{ "url": "https://..." }],
      "seller": {
        "id": "clm...",
        "name": "John Doe",
        "image": null
      }
    }
  }
]
```

## Add Favorite

Add a listing to favorites. Requires authentication.

```
POST /api/favorites
```

### Request Body

```json
{
  "listingId": "clm..."
}
```

### Response

```json
{
  "id": "clm...",
  "userId": "clm...",
  "listingId": "clm...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 400 | Listing already favorited |
| 401 | Not authenticated |
| 404 | Listing not found |

## Remove Favorite

Remove a listing from favorites. Requires authentication.

```
DELETE /api/favorites/[listingId]
```

### Response

```json
{
  "message": "Favorite removed"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Not authenticated |
| 404 | Favorite not found |

## Check if Favorited

The `isFavorited` field is included in listing responses when the user is authenticated:

```json
{
  "id": "clm...",
  "title": "iPhone 14 Pro",
  "isFavorited": true
}
```
