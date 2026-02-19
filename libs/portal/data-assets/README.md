# @redesignhealth/portal/data-assets

Data-layer library for the Platform Portal. Contains all API clients, React Query hooks, TypeScript types, Zod schemas, Zustand stores, and mock/fixture data used by portal features.

## What's in Here

```
src/lib/
├── asset/           # File asset upload API and hooks
├── auth/            # Auth utilities (token handling, session)
├── axios-api.ts     # Configured Axios instance (base URL from VITE_COMPANY_API_HOSTNAME)
├── ceo-directory/   # CEO Directory API, hooks, and types
├── companies/       # Companies API, hooks, and types
├── ip/              # IP Marketplace API, hooks, types, and disclaimer HTML
├── library/         # Knowledge library solution/store/types
├── mock/            # MSW request handlers and fixture data for testing
├── research-hub/    # Research sprint and call notes API + hooks
├── terms/           # Consent/terms configuration and version tracking
├── types/           # Shared portal domain types
├── users/           # Users API and hooks
└── vendors/         # Vendor references API and hooks
```

## Usage

```ts
import {
  useCompanies,
  useUserInfo,
  useResearchSprints,
  useCeos,
} from '@redesignhealth/portal/data-assets'
```

All hooks use **React Query** (`@tanstack/react-query`) for caching and synchronization. The query client is configured in the portal app root.

## API Base URL

Set `VITE_COMPANY_API_HOSTNAME` in `apps/portal/.env.local`:

```ini
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
```

## Running Tests

```bash
nx test portal-data-assets
```
