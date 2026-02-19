# Platform Portal

The main React single-page application for the Redesign Health platform. Built with Vite, React 19, React Router v6, Chakra UI v3, and React Query.

## Running Locally

From the **repo root**:

```bash
# First time only — install all dependencies
npm install

# Start the mock API server (required — portal fetches from http://localhost:8080)
npm run start:api

# Start the portal dev server
npm run start:portal
# → http://localhost:4200
```

See [`apps/api-server/README.md`](../api-server/README.md) for details on the API server.

## Environment Variables

Create `apps/portal/.env.local` using [`.env.local.example`](.env.local.example) as a template.

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `VITE_COMPANY_API_HOSTNAME` | `http://localhost:8080` | Yes | Base URL for the backend API |
| `VITE_GOOGLE_CLIENT_ID` | `*.apps.googleusercontent.com` | Yes | [Google OAuth client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) |
| `VITE_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | No | Google Analytics 4 measurement ID |
| `VITE_HOTJAR_ID` | `XXXXXXX` | No | Hotjar site ID |

> Variables must be prefixed with `VITE_` to be exposed by Vite at build time.

### Supplying variables

Via `.env` files (recommended for local dev):

```ini
# apps/portal/.env.local
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
```

Via command line:

```bash
VITE_COMPANY_API_HOSTNAME=https://staging-api.example.com nx run portal:serve
```

For environment-specific builds, add `.env.build.<configuration>` (e.g. `.env.build.production`). See [Nx environment variable docs](https://nx.dev/recipes/environment-variables/define-environment-variables) for full resolution order.

## Project Structure

```
apps/portal/
├── src/
│   ├── app/             # Root app component, providers, global config
│   ├── routes/          # React Router v6 route tree
│   │   └── dashboard/   # Authenticated dashboard pages
│   │       ├── companies/
│   │       ├── users/
│   │       ├── library/
│   │       ├── research-hub/
│   │       ├── ceo-directory/
│   │       ├── ip-marketplace/
│   │       └── vendor-references/
│   ├── shims/           # Compatibility shims (e.g. chakra-react-select → react-select)
│   └── main.tsx         # Application entry point
├── vite.config.ts
└── project.json
```

## Useful Commands

```bash
# Serve (dev)
nx run portal:serve

# Build
nx run portal:build

# Run unit tests
nx run portal:test

# Lint
nx run portal:lint
```

## Notes

- **Chakra UI v3** — the shared UI library (`@redesignhealth/ui`) provides backward-compatible shims for components renamed or restructured in the v2→v3 migration.
- **`chakra-react-select`** — redirected via a Vite alias to a `react-select` shim (`src/shims/chakra-react-select.ts`) because the library is not compatible with Chakra v3.
- **React Query** (`@tanstack/react-query`) is used for all API data fetching; query clients and hooks live in `libs/portal/data-assets`.
