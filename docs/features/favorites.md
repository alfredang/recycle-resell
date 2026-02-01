# Favorites

Save listings to your personal watchlist.

## Adding Favorites

### From Listing Card

1. Hover over any listing card
2. Click the heart icon
3. Icon fills to indicate saved

### From Listing Detail

1. Open a listing
2. Click the "Save" or heart button
3. Listing is added to favorites

## Viewing Favorites

Navigate to `/favorites` to see all saved listings.

Features:

- Grid view of favorited listings
- Quick access to listing details
- Remove from favorites
- See current status (available/sold)

## Removing Favorites

### From Listing Card

1. Click the filled heart icon
2. Listing is removed

### From Favorites Page

1. Go to `/favorites`
2. Click the heart icon on any listing
3. Listing is removed

## Use Cases

### Shopping List

Save items you're interested in:

- Compare prices later
- Wait for price drops
- Decide between options

### Wishlist

Track items you want:

- Share with friends
- Return when ready to buy
- Monitor availability

### Research

Save for reference:

- Compare similar items
- Check market prices
- Track sellers

## Authentication Required

- Must be signed in to use favorites
- Favorites are linked to your account
- Accessible across devices

## Notifications (Future)

Planned features:

- Price drop alerts
- Sold notifications
- Similar item suggestions

## API Access

Manage favorites programmatically:

```bash
# Get favorites
GET /api/favorites

# Add favorite
POST /api/favorites
{ "listingId": "..." }

# Remove favorite
DELETE /api/favorites/[listingId]
```

See [Favorites API](../api/favorites.md) for details.
