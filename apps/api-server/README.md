# API Server

A lightweight Express mock API server that replicates the Redesign Health backend for local development of the Platform Portal. It serves fully populated mock data and requires no external database or cloud connectivity.

## How to Run

```bash
# From the repo root
npm run start:api
# → http://localhost:8080
```

Or directly:

```bash
npx tsx apps/api-server/src/main.ts
```

## Configuration

Set the portal's `VITE_COMPANY_API_HOSTNAME` environment variable to point at this server:

```ini
# apps/portal/.env.local
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
```

## Mock Data

Seed data lives in `apps/api-server/src/data/db.json` and includes:

| Collection | Count |
|------------|-------|
| Companies | 100 |
| Vendors | 100 |
| CEOs | 50 |
| IP Marketplace listings | 100 |
| Users | 51 (including a Super Admin) |
| Consent records | per user |

To regenerate mock data:

```bash
node apps/api-server/src/data/generate.js
```

## Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/company` | GET, POST | List / create companies |
| `/company/:id` | GET, PUT | Get / update a company |
| `/company/:id/members` | GET | Get company members |
| `/company/:id/conflicts` | PUT | Update company conflicts |
| `/vendor` | GET, POST | List / create vendors |
| `/vendor/:id` | GET, PUT | Get / update a vendor |
| `/vendor/category` | GET | Get vendor categories |
| `/ceos` | GET, POST | List / create CEOs |
| `/ceos/:id` | GET, PUT | Get / update a CEO |
| `/ceos/filters` | GET | Get CEO filter options |
| `/ip-marketplace` | GET, POST | List / create IP listings |
| `/ip-marketplace/:id` | GET | Get an IP listing |
| `/ip-marketplace/filters` | GET | Get IP filter options |
| `/userinfo` | GET | Get current authenticated user |
| `/person` | GET | List all users |
| `/person/:email` | GET, PUT, DELETE | User CRUD by email |
| `/me/role` | GET | Get current user's role |
| `/me/consent/:consentType` | GET, PUT | Get / accept a consent record |
| `/consent` | GET, PUT | General consent management |
| `/research` | GET, POST | Research hub entries |
| `/expert-note` | GET, POST | Expert call notes |
| `/asset` | POST | Asset upload |
| `/library-doc` | GET, POST | Library documents |

All list endpoints support pagination via `page` and `size` query parameters and return the response envelope the portal expects:

```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0,
  "size": 10
}
```

## Implementation Notes

- **CORS** is enabled for all origins to allow the Vite dev server (`localhost:4200`) to connect.
- The `/userinfo` and `/person/:email` responses are normalized by a `normalizeUser` helper that transforms the stored singular `role` field into the `roles` array the portal expects.
- The `/me/consent/:consentType` endpoint returns a mock `ConsentSummary` whose `etag` matches the portal's configured consent version, so the terms modal is automatically bypassed during local development.
