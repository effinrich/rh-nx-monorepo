# portal-features-ceo-directory

Feature library for the **CEO Directory** section of the Platform Portal. Provides a searchable, filterable directory of CEOs with profile cards and detail views.

## Key Components

- `CeoDirectoryPage` — paginated CEO listing with filter sidebar
- `CeoDetail` — full CEO profile view
- CEO filters (industry, company size, geography, etc.)

## Consumed By

`apps/portal` at the `/ceo-directory` route.

## Running Tests

```bash
nx test portal-features-ceo-directory
```
