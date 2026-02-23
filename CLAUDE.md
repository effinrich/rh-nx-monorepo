# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Redesign Health Design System** monorepo, built with Nx. It contains multiple applications and shared libraries organized by domain.

### Key Applications

- **portal** - Main portal application (default project)
- **third-party-network** - Third-party advisor network application
- **parser-playground** - Tool for testing parsers
- **chat-pocs/** - Multiple chat platform POCs (CometChat, RocketChat, Sendbird)
- **expo-poc** - React Native proof of concept
- **company-api** - Backend API service (Spring Boot)
- **oauth-jwt-generator** - OAuth JWT generation service
- **km-docs-lambda** - Knowledge management docs lambda

### Library Organization

Libraries are organized by scope and domain:

- **@redesignhealth/ui** - Shared design system components (Chakra UI-based)
- **@redesignhealth/portal/\*** - Portal-specific features, data access, and UI
  - `features/*` - Feature modules (companies, ceo-directory, library, ip-marketplace, etc.)
  - `data-assets` - API clients, hooks, types
  - `ui` - Portal-specific UI components
  - `utils` - Portal utilities
- **@redesignhealth/third-party-network/\*** - Third-party network modules
- **@redesignhealth/shared-\*** - Shared utilities, hooks, and analytics

All library imports use TypeScript path aliases defined in `tsconfig.base.json`.

## Development Commands

### Running Applications

```bash
# Run from root - Nx will locate and run the correct project
npm start                    # Serves default project (portal)
npm run start:portal         # Portal app
npm run start:parser-playground
nx serve <app-name>          # Any app

# Dev server typically runs on http://localhost:4200/
```

### Building

```bash
npm run build               # Build default project
npm run build:portal        # Build portal specifically
npm run build:ui            # Build shared UI library
nx build <project-name>     # Build any project
```

### Tests

```bash
# Run tests
npm test                           # Run tests for all projects
nx test <project-name>             # Run tests for specific project
nx test <project-name> --watch     # Watch mode
nx test <project-name> --testNamePattern="pattern"  # Run specific test

# Run affected tests (only tests affected by changes)
npm run affected:test
npm run affected:test -- --verbose

# E2E tests
nx e2e <app-name>-e2e
npm run affected:e2e
```

### Linting and Formatting

```bash
npm run lint                    # Lint all projects with auto-fix
npm run lint:portal             # Lint portal with auto-fix
nx lint <project-name> --fix    # Lint specific project

npm run format                  # Check formatting (dry run)
npm run format:write            # Write formatting changes
npm run format:check            # Check without changes
```

### Type Checking

```bash
npm run check-types:all             # Type check all projects
npm run affected:check-types        # Check affected projects
nx check-types <project-name>       # Check specific project
```

### Storybook

```bash
npm run storybook                       # Run shared-ui Storybook
npm run storybook-portal-ui             # Run portal-ui Storybook
npm run storybook-all                   # Run all Storybooks

npm run build-storybook                 # Build Storybook for deployment
npm run build-storybook-portal-ui

npm run test-storybook:shared-ui        # Run Storybook tests
npm run test-storybook:portal-ui
```

### Nx Utilities

```bash
npm run graph                       # View dependency graph
npm run affected:dep-graph          # Graph of affected projects
npm run affected:apps               # List affected apps
npm run affected:libs               # List affected libraries
```

### Chakra UI Theme

```bash
npm run theme           # Generate Chakra theme types
npm run theme:watch     # Watch and regenerate theme types
```

### MCP Server (Storybook Integration)

This repo includes a Model Context Protocol (MCP) server for Storybook component generation:

```bash
npm run mcp:setup                   # First-time setup
npm run mcp:storybook:install       # Install dependencies
npm run mcp:storybook:build         # Build MCP server
npm run mcp:storybook:dev           # Development mode
```

The MCP server is located in `tools/storybook-mcp/`.

## Architecture and Patterns

### Monorepo Structure

This is an Nx monorepo following feature-based architecture. Key principles:

1. **Install all dependencies at root** - Nx automatically includes only what's imported during build/deploy
2. **Run all scripts from root** - No need to cd into subdirectories
3. **Add hoisted scripts to root package.json** - Look at project.json for targets, then add convenience scripts to root

### Module Boundaries

Enforced by ESLint `@nx/enforce-module-boundaries`:

- **scope:shared** libraries can only depend on other **scope:shared** libraries
- **scope:portal** can depend on **scope:portal**, **scope:shared**, and **scope:rocketchat-poc**
- **scope:oauth-jwt-generator** can depend on **scope:oauth-jwt-generator** and **scope:shared**

These constraints are defined in `.eslintrc.json`.

### Import Organization

Imports are automatically sorted by `simple-import-sort` plugin with this order:

1. Side-effect imports
2. React and external packages
3. Internal aliases (@redesignhealth/\*, components, libs, etc.)
4. Parent imports (../)
5. Sibling imports (./)
6. CSS imports

### Styling

- **Emotion** (@emotion/styled) - Default styling solution for React components
- **Chakra UI** - Component library foundation
- File naming convention: **kebab-case** enforced by ESLint

### Data Fetching

- **@tanstack/react-query** - Server state management
- API clients and hooks are in `data-assets` libraries
- Query keys managed with `@lukemorales/query-key-factory`

### Routing

- **react-router-dom** v6 - Client-side routing
- Portal uses RouterProvider with data router pattern
- Auth protected routes use RequireAuth wrapper component

### Testing

- **Jest** - Unit testing (test files use `*.spec.{ts,tsx}` format)
- **React Testing Library** - Component testing
- **Playwright** - E2E testing (for some apps)
- **Storybook Test Runner** - Storybook interaction tests
- **jest-axe** - Accessibility testing

### Analytics

Portal tracks page views manually using Helmet's `onChangeClientState` to ensure dynamic document titles are captured after async data loads.

### Code Generation

```bash
# Generate new app
nx g @nx/react:app my-app

# Generate new library
nx g @nx/react:lib my-lib --directory=libs/shared

# Generate component
nx g @nx/react:component my-component --project=my-app

# Generate API client from OpenAPI
nx generate-company-api-client portal  # Uses workspace generator
```

### OpenAPI Client Generation

Portal has custom targets for generating API clients:

```bash
nx generate-company-api-client portal           # From dev environment
nx generate-company-api-client-local portal     # From localhost:8080
```

These use a workspace generator (`openapi-to-axios-client`) and auto-format the output.

## Important Development Notes

### Package Management

- Use `--legacy-peer-deps` when installing packages
- Only add packages to root `package.json`
- Nx handles dependency pruning during build

### VS Code Setup

- Workspace TypeScript version must be selected (not VS Code's version)
  - Open any .ts file → Cmd/Ctrl+Shift+P → "TypeScript: Select TypeScript Version" → Choose "Use Workspace Version"
- Required extensions are defined in `.vscode/extensions.json`
- Settings in `.vscode/settings.json` are critical for linting/formatting

### Devcontainer Support

The repo includes devcontainer configuration for Docker-based development. See README.md for setup details.

### Git Workflow

- Main branch: `main`
- Nx Cloud is enabled for distributed caching
- Test files follow `*.spec.{ts,tsx,js,jsx}` naming convention

### ESLint Rules to Note

- `@typescript-eslint/no-explicit-any`: error - avoid any types
- `react/no-multi-comp`: warn - one component per file preferred
- `no-console`: warn - avoid console statements
- `react-hooks/exhaustive-deps`: error with autofix enabled
- `unicorn/filename-case`: warn - kebab-case required

### Chromatic Integration

Visual regression testing via Chromatic:

```bash
npm run chromatic  # Run visual tests (only changed, debug mode)
```

## Common Workflows

### Adding a New Feature to Portal

1. Generate feature library: `nx g @nx/react:lib my-feature --directory=libs/portal/features`
2. Add exports to library's `src/index.ts`
3. Add path alias to `tsconfig.base.json` if needed (usually auto-generated)
4. Import in portal routes/components using `@redesignhealth/portal/features/my-feature`
5. Add tests in `*.spec.tsx` files
6. Run `nx test portal-features-my-feature` and `nx lint portal-features-my-feature --fix`

### Working with Shared UI Components

1. Components are in `libs/shared/ui/src/lib/`
2. Each component exports from its own folder
3. Add exports to `libs/shared/ui/src/index.ts`
4. Storybook stories should be co-located with components
5. Build: `npm run build:ui`
6. View in Storybook: `npm run storybook`

### Running Tests for Changed Code

```bash
# Test only what's affected by your changes
npm run affected:test

# Lint only what's affected
npm run affected:lint

# Build only what's affected
npm run affected:build
```

### Type Checking Before Commit

```bash
npm run check-types:all
# Or for affected only:
npm run affected:check-types
```

## File Patterns and Locations

- **Route components**: `apps/portal/src/routes/**/*.tsx`
- **Feature components**: `libs/portal/features/*/src/lib/**/*.tsx`
- **Shared UI components**: `libs/shared/ui/src/lib/**/*`
- **API clients**: `libs/*/data-assets/src/lib/*/api.ts`
- **React Query hooks**: `libs/*/data-assets/src/lib/*/hooks.ts`
- **Types**: `libs/*/data-assets/src/lib/*/types.ts`
- **Test files**: `**/*.spec.{ts,tsx}`
- **Storybook stories**: `**/*.stories.{ts,tsx,mdx}`
- **Project configs**: `apps/*/project.json`, `libs/*/project.json`

## Environment and Configuration

- Node version: >=18.17.1
- NPM version: >=9.6.7
- TypeScript: 5.1.6 (workspace version)
- Default dev server port: 4200
- Build output: `dist/apps/<app-name>` or `dist/libs/<lib-name>`

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

<!-- user configuration start -->

# Senior Frontend Engineer Guidelines (Nx + React + Storybook)

## 🛠 Core Tech Stack

- **Workspace:** [Nx Monorepo](https://nx.dev) (Apps + Libs architecture)
- **Framework:** Next.js (App Router) / React 18+
- **State:** [TanStack Query](https://tanstack.com) (Server), [Zustand](https://zustand-demo.pmnd.rs) (Client)
- **Styling:** Tailwind CSS + [CVA (Class Variance Authority)](https://cva.style)
- **Testing:** [Vitest](https://vitest.dev) (Unit), [Playwright](https://playwright.dev) (E2E), [Storybook](https://storybook.js.org) (Visual/Interaction)

## 🏗 Architectural Guardrails (Nx & Monorepo)

- **Library First:** 80% of code belongs in `libs/`. Apps are minimal shells.
- **Boundary Enforcement:** `ui` libs cannot import `feature` libs. `util` libs cannot import `ui`.
- **Generators Only:** Never manually create project folders. Use Nx Generators.
  - **Create Lib:** `nx g @nx/react:lib libs/shared/ui-components --directory=libs/shared/ui-components --tags=scope:shared,type:ui --importPath=@my-org/shared-ui`
  - **Create Component:** `nx g @nx/react:component my-button --project=shared-ui-components --export`

## 🎨 Storybook & Visual Regression (Chromatic)

- **Mandatory Stories:** Every UI component MUST have a `*.stories.tsx` file using [Storybook Controls](https://storybook.js.orgdocs/essentials/controls).
- **Interaction Testing:** Use the `play` function for behavioral assertions (clicks, form fills).

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

  <!-- user configuration end -->

  <!-- repo configuration start -->

# 🚨 CI/CD Quality Gates

- **Missing Story Check:** CI fails if any `.tsx` in a `type:ui` lib lacks a corresponding `.stories.tsx` file.
- **Visual Regression:** UI changes in `type:ui` projects trigger Chromatic. PRs cannot merge until changes are **Accepted** in the Chromatic Dashboard.

---

# 🚦 Execution Rules (MANDATORY)

- **Zero Fallbacks:** Code must fail loudly. No silent catch blocks or "dummy" data.
- **RSC Patterns:** Components are Server Components by default. Use `'use client'` strictly for interactivity or browser APIs.
- **No Sequential Awaits:** Use `Promise.all()` for concurrent fetching to avoid waterfalls.
- **Full Output:** Never use `// ... existing code`. Always provide the full file content to maintain context.

---

# 🔄 Senior Workflow Protocol

1.  **Explore:** Use `Nx Graph` to visualize dependencies before adding a new library.
2.  **Plan:** State which Nx Generator and tags will be used before execution.
3.  **Verify:** Run `nx affected -t lint,test,build` and `nx run <project>:storybook` to verify changes.

---

# ⌨️ Common Commands

| Action              | Command                                                                   |
| :------------------ | :------------------------------------------------------------------------ |
| **Create Lib**      | `nx g @nx/react:lib <path> --tags=scope:<scope>,type:<type>`              |
| **Add Storybook**   | `nx g @nx/storybook:configuration <project-name> --interactionTests=true` |
| **Verify Affected** | `nx affected -t lint,test`                                                |
| **Run Chromatic**   | `nx run <project>:chromatic --project-token=<token> --only-changed`       |

  <!-- repo configuration end -->

# CLAUDE.md - Frontend Guidelines

## 🛡️ Core Principles

- **Senior Mindset:** You are a senior frontend engineer. Focus on maintainability, scalability, accessibility, and performance.
- **Simplicity:** Impact as little code as possible. Keep functions small and focused [4].
- **"Never be Lazy":** Do not use temporary fixes. Find root causes and implement robust solutions [4].
- **AI Constraints:** Do not hallucinate APIs. Read relevant files first [4].

## 🏗️ Architecture & Component Guidelines

- **Frameworks:** Use [React/Vue/Next.js] with TypeScript.
- **Component Structure:** Use functional components with hooks. Prefer composition over inheritance.
- **State Management:** Use [Redux/Zustand/Context API] for global state; prefer local state for UI-specific logic.
- **Styling:** Use [Tailwind CSS/Styled Components/CSS Modules]. Enforce design system tokens (spacing, colors, typography).
- **File Structure:** Organize by feature/domain, not just by file type.

## 🚀 Performance & Security

- **Code Splitting:** Implement `React.lazy()` for route-based splitting.
- **Performance:** Optimize image loading (`loading="lazy"`) and minimize third-party scripts.
- **Security:** Sanitize user input. Prevent XSS by avoiding `dangerouslySetInnerHTML`.

## 🧑‍💻 Coding Standards

- **Typescript:** STRICT mode only. No `any` types.
- **Testing:** Write tests alongside code (Jest/Vitest + React Testing Library).
- **Accessibility:** Ensure WCAG 2.1 AA compliance. Use semantic HTML and aria-attributes.
- **Linting:** Run `npm run lint` and `npm run format` after any change [8].

## 📝 Workflow Commands

- **Init:** Run `/init` to set up the project structure.
- **Plan:** Draft a plan in `tasks/todo.md` and await approval for complex changes [4].
- **Test:** Run `npm test` before finalizing any changes [8].

## 📚 Documentation

- If complex, explain high-level changes in the PR description [4].
- If changing architecture, update this `CLAUDE.md`.
