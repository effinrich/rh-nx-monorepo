# Redesign Health — Nx Monorepo

<p align="center"><img src="./libs/shared/ui/src/lib/assets/RH_Logo_Single_Ultraviolet.png" width="380"></p>

A full-stack Nx monorepo containing the Platform Portal frontend, mock API server, shared design system, and supporting libraries for Redesign Health.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build System | [Nx 22](https://nx.dev) |
| Frontend | [React 19](https://react.dev) + [Vite](https://vitejs.dev) |
| UI Library | [Chakra UI v3](https://www.chakra-ui.com) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| API Server | [Express](https://expressjs.com) via `tsx` |
| Unit Tests | [Jest](https://jestjs.io) / [Vitest](https://vitest.dev) |
| E2E Tests | [Playwright](https://playwright.dev) |
| Linting | [ESLint](https://eslint.org) + [Prettier](https://prettier.io) |

## Repository Structure

```
rh-nx-monorepo/
├── apps/
│   ├── portal/               # Platform Portal React app (Vite, port 4200)
│   ├── api-server/           # Mock Express API server (port 8080)
│   └── company-api/          # Spring Boot Company API
├── libs/
│   ├── shared/
│   │   ├── ui/               # @redesignhealth/ui — shared Chakra v3 component library
│   │   ├── analytics/        # Google Analytics 4 event helpers
│   │   ├── hooks/            # Shared React hooks
│   │   ├── utils/            # General-purpose utilities
│   │   └── utils-jest/       # Jest/Vitest test utilities
│   ├── portal/
│   │   ├── data-assets/      # API clients, hooks, types, and mock data for portal
│   │   ├── ui/               # Portal-specific UI components
│   │   ├── utils/            # Portal-specific utilities
│   │   └── features/         # Feature-sliced pages (companies, users, library, …)
│   ├── third-party-network/
│   │   ├── features/         # Advisor network feature pages
│   │   ├── ui/               # Third-party network UI components
│   │   ├── utils/            # Third-party network utilities
│   │   └── data-assets/      # API clients and data for advisor network
│   └── company-api-types/    # OpenAPI-generated TypeScript types for Company API
├── tools/                    # Storybook MCP server, VS Code theme
├── playwright/               # End-to-end test suite
└── docs/                     # MkDocs documentation site
```

## Quick Start

> All commands should be run from the **repo root**. Nx resolves the correct project automatically.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the API server

```bash
npm run start:api
# Starts Express mock server on http://localhost:8080
```

### 3. Start the Portal

```bash
npm run start:portal
# Starts Vite dev server on http://localhost:4200
```

### Environment Variables

Create `apps/portal/.env.local` (use `.env.local.example` as a template):

```ini
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX   # optional
VITE_HOTJAR_ID=XXXXXXX                  # optional
```

## Common Commands

| Task | Command |
|------|---------|
| Serve portal | `nx run portal:serve` |
| Serve API server | `nx run api-server:serve` |
| Build portal | `nx build portal` |
| Run all tests | `nx run-many -t test` |
| Run portal tests | `nx test portal` |
| Lint all projects | `nx run-many -t lint` |
| Run E2E tests | `nx e2e portal-e2e` |
| View dependency graph | `nx graph` |
| Run Storybook | `npm run storybook` |

## Workspace Notes

- **One root `package.json`** — install all packages here. Nx pulls only what each app needs during build.
- **Affected commands** — `nx affected -t test` or `nx affected -t build` run only on projects changed since the last commit, keeping CI fast.
- **Path aliases** — libraries are imported as `@redesignhealth/<lib>` (e.g., `@redesignhealth/ui`, `@redesignhealth/portal/data-assets`).
- **Shared UI is on Chakra v3** — components that were renamed or restructured in the v2→v3 migration have backward-compatible shims in `libs/shared/ui/src/lib/`.

## VS Code Setup

Using VS Code with the [Nx Console extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) is strongly recommended.

On first open you should see a prompt to use the **workspace TypeScript version** — accept it, or set it manually:

1. Open any `.ts` file
2. `Ctrl+Shift+P` → **TypeScript: Select TypeScript Version**
3. Choose **Use Workspace Version**

Refer to [`.vscode/settings.json`](.vscode/settings.json) and [`.vscode/extensions.json`](.vscode/extensions.json) for the recommended editor config.

## Devcontainer Setup

A devcontainer is available for a reproducible local environment.

**Prerequisites**

1. [VS Code](https://code.visualstudio.com/download) + [Remote Development Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
2. [Rancher Desktop](https://rancherdesktop.io/) (container runtime: `dockerd`, ≥16 GB RAM, 4 CPUs)

**Steps**

1. In VS Code click the `><` icon (bottom-left) → **Clone Repository in Container Volume**
2. Enter the GitHub HTTPS URL for this repo
3. The devcontainer builds from [`.devcontainer/Dockerfile`](.devcontainer/Dockerfile)
   - `~/.m2` and `~/.npm` are bind-mounted — ensure they exist locally
   - Authenticate GitHub Packages via `~/.m2/settings.xml` (see [shared-java README](./libs/shared-java/data-access-aws-secrets-manager-property-source/README.md))

After changes to `Dockerfile` or `devcontainer.json`, click `>< Dev Container` → **Rebuild Container**.

Additional reading: [VS Code Containers docs](https://code.visualstudio.com/docs/remote/containers)

## Further Reading

- [Nx Documentation](https://nx.dev)
- [Chakra UI v3 Docs](https://www.chakra-ui.com)
- [Platform Documentation](https://dev-design.redesignhealth.com/platform-documentation-library/platform-intro.html)
- [Storybook](https://dev-design.redesignhealth.com/storybook/shared-ui/index.html)
