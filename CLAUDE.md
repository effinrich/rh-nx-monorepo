# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Redesign Health Design System** monorepo built with Nx 22. Contains the Platform Portal frontend, mock API server, shared Chakra v3 component library, and supporting libraries.

### Key Applications

- **portal** — Main platform app (React 19 + Vite, port 4200, default project)
- **api-server** — Mock Express API server (port 8080, used for local development)
- **third-party-network** — Third-party advisor network app
- **company-api** — Spring Boot backend API service
- **parser-playground** — Parser testing tool

### Library Organization

Libraries use TypeScript path aliases from `tsconfig.base.json`, imported as `@redesignhealth/<scope>/<lib>`:

- **@redesignhealth/ui** — Shared Chakra v3 component library (`libs/shared/ui/`)
- **@redesignhealth/portal/data-assets** — API clients, hooks, types, mock data
- **@redesignhealth/portal/features/\*** — Feature-sliced pages (companies, ceo-directory, library, ip-marketplace, etc.)
- **@redesignhealth/portal/ui** — Portal-specific UI components
- **@redesignhealth/shared-\*** — Shared utilities, hooks, analytics

### Module Boundaries

Enforced by ESLint `@nx/enforce-module-boundaries` (defined in `.eslintrc.json`):

- **scope:shared** can only depend on **scope:shared**
- **scope:portal** can depend on **scope:portal** and **scope:shared**
- **type:ui** libs cannot import **type:feature** libs; **type:util** cannot import **type:ui**

## Development Commands

```bash
# Serve
npm run start:portal              # Portal on http://localhost:4200
npm run start:api                 # Mock API on http://localhost:8080
nx serve <app-name>               # Any app

# Build
nx build <project-name>
npm run build:ui                  # Shared UI library

# Test
nx test <project-name>                              # Single project
nx test <project-name> --watch                      # Watch mode
nx test <project-name> --testNamePattern="pattern"  # Specific test
npm run affected:test                               # Only changed projects

# Lint & Format
nx lint <project-name> --fix
npm run format:write              # Apply Prettier formatting

# Type Check
npm run check-types:all
npm run affected:check-types

# Storybook
npm run storybook                 # Shared UI Storybook
npm run storybook-portal-ui       # Portal UI Storybook

# Verify before commit
nx affected -t lint,test,build
```

### OpenAPI Client Generation

```bash
nx generate-company-api-client portal         # From dev environment
nx generate-company-api-client-local portal   # From localhost:8080
```

Uses workspace generator `openapi-to-axios-client` with auto-formatting.

### @effinrich/nx-storybook Plugin

Custom Nx plugin at `tools/@effinrich/nx-storybook/` for auto-generating stories and tests:

```bash
nx g @effinrich/nx-storybook:story --componentPath=<path>          # Single component
nx g @effinrich/nx-storybook:stories --project=<name>              # Bulk generate for project
nx g @effinrich/nx-storybook:component-test --componentPath=<path> # Playwright .ct.tsx
```

## Architecture and Patterns

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Nx 22 |
| Frontend | React 19 + Vite |
| UI Library | Chakra UI v3 |
| Language | TypeScript 5 (strict) |
| Server State | @tanstack/react-query (keys via @lukemorales/query-key-factory) |
| Routing | react-router-dom v6 (RouterProvider + data router pattern) |
| Unit Tests | Jest + React Testing Library |
| E2E Tests | Playwright (co-located as `.ct.tsx`) |
| Visual Regression | Chromatic |
| Linting | ESLint + Prettier (simple-import-sort) |

### Key Patterns

- **Library-first**: 80% of code in `libs/`. Apps are thin shells.
- **Feature-sliced**: Each feature is its own library under `libs/<scope>/features/`.
- **Data layer**: API clients (`api.ts`), hooks (`hooks.ts`), and types (`types.ts`) live in `data-assets` libraries.
- **Auth**: Protected routes use `RequireAuth` wrapper component.
- **Analytics**: Portal tracks page views via Helmet's `onChangeClientState` for dynamic titles after async loads.

### Import Sort Order

Enforced by `simple-import-sort`:

1. Side-effect imports → 2. React/external packages → 3. `@redesignhealth/*` aliases → 4. Parent `../` → 5. Sibling `./` → 6. CSS

### ESLint Rules

- `@typescript-eslint/no-explicit-any`: **error** — no `any` types
- `react-hooks/exhaustive-deps`: **error** with autofix
- `react/no-multi-comp`: warn — one component per file
- `no-console`: warn
- `unicorn/filename-case`: warn — **kebab-case** required

## Chakra UI v3 Rules

This project completed a full v2→v3 migration. Follow these rules for all `.tsx` files:

### Import Sources

**From `@chakra-ui/react`:** Alert, Avatar, Button, Card, Field, Table, Input, NativeSelect, Tabs, Textarea, Separator, useDisclosure, Box, Flex, Stack, HStack, VStack, Text, Heading, Icon

**From `components/ui` (relative imports):** Provider, Toaster, ColorModeProvider, Tooltip, PasswordInput

### Removed Packages

- `@emotion/styled` and `framer-motion` — no longer used
- `@chakra-ui/icons` → use `lucide-react` or `react-icons`
- `@chakra-ui/hooks` → use `react-use` or `usehooks-ts`

### Prop Renames

| v2 | v3 |
|----|-----|
| `isOpen` | `open` |
| `isDisabled` | `disabled` |
| `isInvalid` | `invalid` |
| `isRequired` | `required` |
| `isLoading` | `loading` |
| `isChecked` | `checked` |
| `colorScheme` | `colorPalette` |
| `spacing` | `gap` |
| `noOfLines` | `lineClamp` |

### Component Renames

- Divider → **Separator**, Modal → **Dialog**, Collapse → **Collapsible**, Tags → **Badge**
- `useToast()` → `toaster.create()`

### Style System Changes

```tsx
// Nested styles: sx → css (& is required)
<Box css={{ "& svg": { color: "red.500" } }} />

// Gradients
<Box bgGradient="to-r" gradientFrom="red.200" gradientTo="pink.500" />

// Theme access
const system = useChakra()
const gray400 = system.token("colors.gray.400")
```

### Component Patterns

- Use compound components for complex components
- Use `asChild` instead of wrapper component patterns
- Always use `VStack`/`HStack`, not `Stack`

## CI/CD Quality Gates

- **Missing Story Check**: CI fails if any `.tsx` in a `type:ui` lib lacks a `.stories.tsx` file.
- **Visual Regression**: UI changes in `type:ui` projects trigger Chromatic. PRs cannot merge until changes are accepted in the Chromatic Dashboard.
- **Affected verification**: `nx affected -t lint,test,build`

## Storybook

Every UI component must have a co-located `*.stories.tsx` file with Controls. Use the `play` function for interaction tests:

```typescript
export const SubmittedForm: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Submit', async () => {
      await userEvent.type(canvas.getByTestId('email'), 'senior@dev.com')
      await userEvent.click(canvas.getByRole('button'))
    })
    await expect(canvas.getByText('Success')).toBeInTheDocument()
  }
}
```

## Package Management

- Install with `--legacy-peer-deps`
- Only add packages to root `package.json`
- Node >=18.17.1, NPM >=9.6.7

## Environment Setup

Create `apps/portal/.env.local` from `.env.local.example`:

```ini
VITE_COMPANY_API_HOSTNAME=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
```

## Code Generation

```bash
nx g @nx/react:lib <path> --tags=scope:<scope>,type:<type>     # New library
nx g @nx/react:component my-component --project=<name> --export # New component
```

Never manually create project folders — always use Nx Generators.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
