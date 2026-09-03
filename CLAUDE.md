# CLAUDE.md

Redesign Health Design System — an Nx monorepo of React apps and shared libraries, plus a few JVM/serverless services.

Stack: React 19, TypeScript 5.9 (strict), Chakra UI v3 (+ `@emotion/react`), TanStack Query v5, react-router-dom v6, Nx 22, Jest 30 + React Testing Library, Playwright, Storybook 10, Chromatic. Package manager is **npm** (`package-lock.json`); Node 24.12.0, npm 11.6.2 (`engines`).

## Project map

Apps (`apps/`):

- `portal` — main portal app, the default Nx project
- `third-party-network` — third-party advisor network app
- `parser-playground` — parser testing tool
- `docs` — documentation site
- `api-server` — Node API server
- `company-api` — Spring Boot backend
- `oauth-jwt-generator` — OAuth JWT service
- `km-docs-lambda` (+ `-e2e`) — knowledge-management docs lambda
- `chat-pocs/` — CometChat / RocketChat / Sendbird POCs
- `ff4j-rh`, `opcofin`, `prometheus` — supporting services

Libraries (`libs/`), imported via TypeScript path aliases in `tsconfig.base.json`:

- `shared/ui` → `@redesignhealth/ui` — shared Chakra-based design system
- `shared/{analytics,hooks,markdown-renderer,utils,utils-jest}` → `@redesignhealth/shared-*`
- `portal/{features,data-assets,ui,utils}` → `@redesignhealth/portal/*`
- `third-party-network/*`, `company-api-types`, `shared-java`

Tooling (`tools/`): `generators/` (workspace generators), `storybook-mcp/` (MCP server), `forgekit-nx-storybook/`, `code-themes/`, `portal-data-loaders/`.

<important if="you need to run a build, test, lint, typecheck, storybook, or generator command">

Run everything from the repo root — Nx locates the project. Prefer `nx affected` over `--all` on a branch.

| Command | What it does |
|---|---|
| `npm start` | Serve default project (portal) |
| `npm run start:portal` | Serve portal |
| `npm run start:parser-playground` | Serve parser-playground |
| `npm run start:api` | Run api-server via `tsx` |
| `nx serve <app>` | Serve any app |
| `npm run build` | Build default project |
| `npm run build:portal` | Build portal |
| `npm run build:ui` | Build `shared-ui` |
| `nx build <project>` | Build any project |
| `npm test` | Test default project |
| `npm run test:portal` | Test portal |
| `nx test <project>` | Test a project (`--watch`, `--testNamePattern=<pat>`) |
| `nx e2e <app>-e2e` | E2E tests |
| `npm run lint` | Lint all projects with `--fix` |
| `npm run lint:portal` | Lint portal with `--fix` |
| `nx lint <project> --fix` | Lint one project |
| `npm run format` | Format check (dry run) |
| `npm run format:write` | Apply formatting |
| `npm run format:check` | Format check |
| `npm run check-types:all` | Typecheck all projects |
| `nx check-types <project>` | Typecheck one project |
| `npm run affected` | Run affected targets |
| `npm run affected:build` / `:test` / `:lint` / `:check-types` | Affected-only runs |
| `npm run affected:apps` / `:libs` | List affected projects |
| `npm run graph` / `npm run affected:dep-graph` | Dependency graph |
| `npm run storybook` | shared-ui Storybook |
| `npm run storybook-portal-ui` | portal-ui Storybook |
| `npm run storybook-all` | Both Storybooks |
| `npm run build-storybook` / `build-storybook-portal-ui` | Build Storybook |
| `npm run test-storybook:shared-ui` / `:portal-ui` | Storybook test runner |
| `npm run chromatic` | Chromatic visual tests (changed only) |
| `npm run theme` / `theme:watch` | Generate Chakra theme types |
| `npm run docs:dev` / `:build` / `:validate` / `:lint` | Docs site |
| `npm run mcp:setup` | First-time Storybook MCP setup |
| `npm run mcp:storybook:install` / `:build` / `:dev` | Storybook MCP server (`tools/storybook-mcp/`) |
| `npm run update` | `nx migrate latest` + install + migrations + format + test |
| `npm run reset` / `repair` / `help` | Nx maintenance |

Note: docs elsewhere may mention `affected:e2e` — it is not a root script. Use `nx affected -t e2e`.
</important>

<important if="you are installing, adding, or upgrading a package">

- Install with `npm install --legacy-peer-deps`. Peer ranges in this repo do not resolve without it.
- Add dependencies to the **root** `package.json` only, never to a project's own. Nx prunes per-project deps at build time.
</important>

<important if="you are creating a new library or app, or adding an import that crosses library boundaries">

Use Nx generators — never hand-create project folders. Add `--tags=scope:<scope>,type:<type>`; the tags drive boundary enforcement.

- App: `nx g @nx/react:app <name>`
- Library: `nx g @nx/react:lib <name> --directory=libs/<scope>/<name>`
- Component: `nx g @nx/react:component <name> --project=<project>`

`@nx/enforce-module-boundaries` (configured in `.eslintrc.json`, legacy eslintrc format) restricts:

- `scope:shared` → `scope:shared` only
- `scope:portal` → `scope:portal`, `scope:shared`, `scope:rocketchat-poc`
- `scope:oauth-jwt-generator` → `scope:oauth-jwt-generator`, `scope:shared`

Export new library code from the library's `src/index.ts`, then import via its `@redesignhealth/*` alias.
</important>

<important if="you are writing or restyling a React component">

- Chakra UI v3 is the component foundation; style with Chakra props/recipes and the theme in `libs/shared/ui/src/lib/theme/`. `@emotion/react` is present as Chakra's runtime — there is no `@emotion/styled` dependency, so do not introduce `styled` components.
- After changing theme tokens, run `npm run theme` to regenerate Chakra types.
- Shared components live in `libs/shared/ui/src/lib/<component>/` and are re-exported from `libs/shared/ui/src/index.ts`.
</important>

<important if="you are fetching data or adding an API client">

- TanStack Query v5 for server state; API clients, hooks, and types live in the `data-assets` libraries (`api.ts`, `hooks.ts`, `types.ts`).
- Query keys are built with `@lukemorales/query-key-factory`.
- Generate the company API client rather than hand-writing it (workspace generator `openapi-to-axios-client`, output auto-formatted):
  - `nx generate-company-api-client portal` — from dev environment
  - `nx generate-company-api-client-local portal` — from `localhost:8080`
</important>

<important if="you are adding or changing routes">

react-router-dom v6. Portal uses `RouterProvider` with the data-router pattern; route components are in `apps/portal/src/routes/`. Protected routes wrap in `RequireAuth`.
</important>

<important if="you are writing or fixing tests">

- Unit/component: **Jest 30** + React Testing Library. Test files are `*.spec.{ts,tsx}` (126 of them; `*.test.*` is not the convention here). Vitest is present in the tree but Jest is the established runner — match the sibling files in the project you are editing.
- E2E: Playwright.
- Accessibility: `jest-axe`.
- Storybook interaction tests run through the Storybook test runner (`npm run test-storybook:*`).
</important>

<important if="you are adding or changing a Storybook story or a UI component that Chromatic will diff">

- Every component in a `type:ui` library needs a co-located `*.stories.tsx`; CI checks for this (`.github/workflows/`).
- Use the `play` function for interaction assertions.
- Chromatic runs on UI changes (`.github/workflows/chromatic.yml`) and its diffs must be accepted in the Chromatic dashboard before merge.
</important>

<important if="you are tracking page views or touching analytics">

Portal tracks page views manually via Helmet's `onChangeClientState`, so dynamic document titles are captured after async data resolves. Do not replace this with a plain route-change listener.
</important>

<important if="you are looking for where a particular kind of file lives">

- Route components — `apps/portal/src/routes/**/*.tsx`
- Feature components — `libs/portal/features/*/src/lib/**/*.tsx`
- Shared UI — `libs/shared/ui/src/lib/**/*`
- API clients / hooks / types — `libs/*/data-assets/src/lib/*/{api,hooks,types}.ts`
- Tests — `**/*.spec.{ts,tsx}`
- Stories — `**/*.stories.{ts,tsx,mdx}`
- Project configs — `apps/*/project.json`, `libs/*/project.json`
- Build output — `dist/apps/<app>` or `dist/libs/<lib>`
</important>

<important if="you are setting up the repo locally or debugging editor/type-resolution problems">

- Select the **workspace** TypeScript version in VS Code (Cmd/Ctrl+Shift+P → "TypeScript: Select TypeScript Version" → Use Workspace Version). Editor-version mismatches cause phantom type errors.
- `.vscode/extensions.json` and `.vscode/settings.json` are load-bearing for lint/format on save.
- Devcontainer config is included for Docker-based development; see README.md.
</important>

<important if="you are about to open a PR or hand off work">

Nx Cloud distributed caching is enabled, so affected runs are cheap. Before handing off: `nx affected -t lint,test,check-types,build`. Main branch is `main`.
</important>

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
