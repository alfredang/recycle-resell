# API Overview

ReResell provides a RESTful API for all operations. All endpoints are located under `/api/`.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://recycle-resell.netlify.app/api`

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. The session is automatically managed when using the web application.

## Response Format

All API responses follow this format:

### Success Response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": {}
}
```

## API Endpoints

### Listings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | List all listings |
| POST | `/api/listings` | Create a listing |
| GET | `/api/listings/[id]` | Get a single listing |
| PUT | `/api/listings/[id]` | Update a listing |
| DELETE | `/api/listings/[id]` | Delete a listing |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user's favorites |
| POST | `/api/favorites` | Add a favorite |
| DELETE | `/api/favorites/[listingId]` | Remove a favorite |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js handlers |

### Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload images |

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider adding rate limiting.

## CORS

The API only accepts requests from the same origin. Cross-origin requests are not supported.
