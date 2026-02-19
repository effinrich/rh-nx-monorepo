# portal-features-ip-marketplace

Feature library for the **IP Marketplace** section of the Platform Portal. Provides listings, detail pages, and buyer/seller disclaimer flows for intellectual property transactions.

## Key Components

- `IpMarketplacePage` — filterable IP listing grid
- `IpListingDetail` — individual listing view with contact and disclaimer workflow
- Buyer and seller disclaimer modals (with GA4 event tracking on accept)

## Consumed By

`apps/portal` at the `/ip-marketplace` route.

## Running Tests

```bash
nx test portal-features-ip-marketplace
```
