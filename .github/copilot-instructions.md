# GitHub Copilot Instructions

This file provides custom instructions for GitHub Copilot when working with code in the Redesign Health Design System monorepo.

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
- **@redesignhealth/portal/*** - Portal-specific features, data access, and UI
  - `features/*` - Feature modules (companies, ceo-directory, library, ip-marketplace, etc.)
  - `data-assets` - API clients, hooks, types
  - `ui` - Portal-specific UI components
  - `utils` - Portal utilities
- **@redesignhealth/third-party-network/*** - Third-party network modules
- **@redesignhealth/shared-*** - Shared utilities, hooks, and analytics

All library imports use TypeScript path aliases defined in `tsconfig.base.json`.

## Development Commands

### Running Applications

Run from root - Nx will locate and run the correct project:

- `npm start` - Serves default project (portal)
- `npm run start:portal` - Portal app
- `npm run start:parser-playground` - Parser playground
- `nx serve <app-name>` - Any app

Dev server typically runs on http://localhost:4200/

### Building

- `npm run build` - Build default project
- `npm run build:portal` - Build portal specifically
- `npm run build:ui` - Build shared UI library
- `nx build <project-name>` - Build any project

### Testing

- `npm test` - Run tests for all projects
- `nx test <project-name>` - Run tests for specific project
- `nx test <project-name> --watch` - Watch mode
- `npm run affected:test` - Run affected tests only
- `nx e2e <app-name>-e2e` - E2E tests

Test files use `*.spec.{ts,tsx,js,jsx}` naming convention.

### Linting and Formatting

- `npm run lint` - Lint all projects with auto-fix
- `npm run lint:portal` - Lint portal with auto-fix
- `nx lint <project-name> --fix` - Lint specific project
- `npm run format:write` - Write formatting changes
- `npm run format:check` - Check formatting without changes

### Type Checking

- `npm run check-types:all` - Type check all projects
- `npm run affected:check-types` - Check affected projects only
- `nx check-types <project-name>` - Check specific project

### Storybook

- `npm run storybook` - Run shared-ui Storybook
- `npm run storybook-portal-ui` - Run portal-ui Storybook
- `npm run storybook-all` - Run all Storybooks
- `npm run build-storybook` - Build Storybook for deployment

## Coding Standards and Conventions

### File Naming

Use **kebab-case** for all files. This is enforced by ESLint.

### Import Organization

Imports are automatically sorted by `simple-import-sort` plugin in this order:

1. Side-effect imports
2. React and external packages
3. Internal aliases (@redesignhealth/*, components, libs, etc.)
4. Parent imports (../)
5. Sibling imports (./)
6. CSS imports

### Component Structure

- One component per file (preferred, enforced by `react/no-multi-comp` warning)
- Use functional components with hooks
- Co-locate Storybook stories with components
- Add tests in `*.spec.tsx` files alongside components

### Styling

- Use **Emotion** (@emotion/styled) for component styling
- Use **Chakra UI** components as foundation
- Follow existing theme patterns in `libs/shared/ui/src/lib/theme/`
- Run `npm run theme` after modifying theme to generate types

### TypeScript

- Avoid `any` types (`@typescript-eslint/no-explicit-any` is an error)
- Use workspace TypeScript version (5.1.6)
- Define types in `types.ts` files within data-assets libraries
- Leverage path aliases defined in `tsconfig.base.json`

### React Patterns

- Use React Query (@tanstack/react-query) for server state
- Define API clients in `data-assets` libraries
- Create custom hooks in `hooks.ts` files
- Use `@lukemorales/query-key-factory` for query key management
- Follow data router pattern with react-router-dom v6
- Use RequireAuth wrapper for protected routes

### Testing

- Use Jest with React Testing Library for component tests
- Use Playwright for E2E tests where available
- Use Storybook Test Runner for interaction tests
- Include accessibility tests with jest-axe
- Test files should match `*.spec.{ts,tsx,js,jsx}` format

### ESLint Rules

Key rules to follow:

- No `any` types
- No console statements (use proper logging)
- React hooks dependencies must be exhaustive
- One component per file (preferred)
- Kebab-case file naming

## Monorepo Patterns

### Module Boundaries

Enforced by `@nx/enforce-module-boundaries`:

- **scope:shared** libraries can only depend on other **scope:shared** libraries
- **scope:portal** can depend on **scope:portal**, **scope:shared**, and **scope:rocketchat-poc**
- **scope:oauth-jwt-generator** can depend on **scope:oauth-jwt-generator** and **scope:shared**

### Package Management

- Install all dependencies at root using `npm install --legacy-peer-deps`
- Never install packages in subdirectories
- Nx automatically includes only imported packages during build/deploy
- Run all scripts from root

### Script Management

- Run all commands from repository root
- Add convenience scripts to root `package.json`
- Look at project.json for available targets
- Use Nx commands: `nx <target> <project-name>`

## Code Generation

### Generating New Code

- New app: `nx g @nx/react:app my-app`
- New library: `nx g @nx/react:lib my-lib --directory=libs/shared`
- New component: `nx g @nx/react:component my-component --project=my-app`
- API client from OpenAPI: `nx generate-company-api-client portal`

### Adding a New Feature to Portal

1. Generate feature library: `nx g @nx/react:lib my-feature --directory=libs/portal/features`
2. Add exports to library's `src/index.ts`
3. Verify path alias in `tsconfig.base.json` (usually auto-generated)
4. Import using `@redesignhealth/portal/features/my-feature`
5. Add tests in `*.spec.tsx` files
6. Run `nx test portal-features-my-feature` and `nx lint portal-features-my-feature --fix`

### Working with Shared UI Components

1. Components are in `libs/shared/ui/src/lib/`
2. Each component exports from its own folder
3. Add exports to `libs/shared/ui/src/index.ts`
4. Co-locate Storybook stories with components
5. Build: `npm run build:ui`
6. View in Storybook: `npm run storybook`

## File Locations

- **Route components**: `apps/portal/src/routes/**/*.tsx`
- **Feature components**: `libs/portal/features/*/src/lib/**/*.tsx`
- **Shared UI components**: `libs/shared/ui/src/lib/**/*`
- **API clients**: `libs/*/data-assets/src/lib/*/api.ts`
- **React Query hooks**: `libs/*/data-assets/src/lib/*/hooks.ts`
- **Types**: `libs/*/data-assets/src/lib/*/types.ts`
- **Test files**: `**/*.spec.{ts,tsx}`
- **Storybook stories**: `**/*.stories.{ts,tsx,mdx}`
- **Project configs**: `apps/*/project.json`, `libs/*/project.json`

## Important Workflows

### Testing Changes

Test only affected code:

- `npm run affected:test` - Run affected tests
- `npm run affected:lint` - Lint affected code
- `npm run affected:build` - Build affected projects

### Before Committing

Always run:

- `npm run check-types:all` or `npm run affected:check-types`
- `npm run lint` or `npm run affected:lint`
- `npm run affected:test`

### Chromatic Visual Testing

Run visual regression tests: `npm run chromatic`

## Environment Configuration

- Node version: >=18.17.1
- NPM version: >=9.6.7
- TypeScript: 5.1.6 (workspace version)
- Default dev server port: 4200
- Build output: `dist/apps/<app-name>` or `dist/libs/<lib-name>`

## Additional Context

### VS Code Setup

- Use workspace TypeScript version (not VS Code's version)
- Required extensions defined in `.vscode/extensions.json`
- Settings in `.vscode/settings.json` are critical for linting/formatting

### Git Workflow

- Main branch: `main`
- Nx Cloud enabled for distributed caching
- Test files follow `*.spec.{ts,tsx,js,jsx}` naming

### Analytics

Portal tracks page views manually using Helmet's `onChangeClientState` to capture dynamic document titles after async data loads.

### MCP Server

Repository includes a Model Context Protocol (MCP) server for Storybook component generation in `tools/storybook-mcp/`. Setup commands: `npm run mcp:setup`, `npm run mcp:storybook:build`, `npm run mcp:storybook:dev`.

### Devcontainer Support

The repository includes devcontainer configuration for Docker-based development. See README.md for detailed setup instructions.
