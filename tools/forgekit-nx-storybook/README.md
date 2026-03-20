# @effinrich/nx-storybook

A companion plugin for [`@nx/storybook`](https://nx.dev/nx-api/storybook) that auto-generates Storybook stories, interaction tests, Playwright component tests, and accessibility audits from React component analysis.

## How it works with @nx/storybook

`@nx/storybook` handles the **infrastructure** — scaffolding `.storybook/main.ts` and `preview.ts`, serving/building Storybook, running the test runner, and managing Storybook version migrations. It does not generate individual story files.

`@effinrich/nx-storybook` handles the **content** — analyzing your React components and generating ready-to-use `.stories.tsx` and `.ct.tsx` files with controls, variants, interaction tests, and accessibility checks.

**Use both together.** This plugin requires `@nx/storybook` as a peer dependency and delegates all config scaffolding to it.

| Concern | @nx/storybook | @effinrich/nx-storybook |
|---|:---:|:---:|
| Scaffold `.storybook/` config | Yes | Delegates to @nx/storybook |
| Serve / build Storybook | Yes | -- |
| Storybook test runner | Yes | -- |
| Version migrations (v8→v9→v10) | Yes | -- |
| Auto-generate `.stories.tsx` from components | -- | Yes |
| ArgTypes, controls, default args from props | -- | Yes |
| Variant / size / colorPalette stories | -- | Yes |
| Interaction tests (play functions) | -- | Yes |
| Accessibility audit stories (axe-core) | -- | Yes |
| Keyboard navigation tests | -- | Yes |
| Co-located Playwright component tests (`.ct.tsx`) | -- | Yes |
| Visual regression snapshots | -- | Yes |
| Bulk generation with coverage scoring (A–F) | -- | Yes |
| File watcher for auto-updates | -- | Yes |
| Framework detection (Router, Chakra, React Query) | -- | Yes |

## Prerequisites

- **@nx/storybook** >= 19.0.0 (install first, configure at least one project)
- **Nx** >= 19.0.0
- **Storybook** >= 8.0.0
- **TypeScript** >= 5.0.0
- **Node.js** >= 18.17.1

### Quick setup

```bash
# 1. Install @nx/storybook and configure a project (if not already done)
npm install --save-dev @nx/storybook --legacy-peer-deps
npx nx g @nx/storybook:configuration --project=<your-ui-library>

# 2. Install this plugin
npx nx add @effinrich/nx-storybook
```

The `init` generator runs automatically on `nx add` and will verify `@nx/storybook` is present, ensure Storybook core dependencies are installed, and display available commands.

### For Playwright component tests

```bash
npm install --save-dev @playwright/experimental-ct-react @axe-core/playwright --legacy-peer-deps
```

## Generators

### `story` — Generate a story for one component

```bash
npx nx g @effinrich/nx-storybook:story --componentPath=libs/shared/ui/src/lib/button/button.tsx
```

Produces a `.stories.tsx` file with:
- `Meta` with autodocs, argTypes, default args
- `Default` story
- `Sizes` / `Variants` / `ColorPalettes` / `Disabled` stories (when matching props detected)
- `ClickInteraction` / `KeyboardNavigation` / `RendersCorrectly` interaction tests
- `AccessibilityAudit` story (tagged `a11y`, works with `@storybook/addon-a11y`)

| Option | Type | Default | Description |
|---|---|---|---|
| `--componentPath` | `string` | **(required)** | Path to the component file |
| `--project` | `string` | auto-detected | Nx project |
| `--storyTitle` | `string` | auto-generated | Custom Storybook title |
| `--skipInteractionTests` | `boolean` | `false` | Skip play functions |
| `--overwrite` | `boolean` | `false` | Overwrite existing story |
| `--dryRun` | `boolean` | `false` | Preview without writing |

### `stories` — Bulk generate for an entire project

```bash
npx nx g @effinrich/nx-storybook:stories --project=shared-ui
```

Scans every component in the project, skips those that already have stories, generates for the rest, and reports a **coverage score**:

```
  ✔ Story Coverage: 85% (140/166) — Grade: B

  ℹ Generated: 70
  ℹ Already covered: 70
  ℹ Total components: 166
```

| Option | Type | Default | Description |
|---|---|---|---|
| `--project` | `string` | **(required)** | Nx project to scan |
| `--skipInteractionTests` | `boolean` | `false` | Skip play functions |
| `--overwrite` | `boolean` | `false` | Overwrite all existing stories |
| `--dryRun` | `boolean` | `false` | Preview without writing |
| `--includeA11y` | `boolean` | `true` | Include a11y audit stories |
| `--includeComponentTests` | `boolean` | `false` | Also generate Playwright `.ct.tsx` files |

### `component-test` — Generate a Playwright component test

```bash
npx nx g @effinrich/nx-storybook:component-test --componentPath=libs/shared/ui/src/lib/button/button.tsx
```

Produces a co-located `.ct.tsx` file with:
- **Mount & render** — verifies the component mounts without crashing
- **Visual regression** — `toHaveScreenshot()` for default state and every variant/size/colorPalette value
- **Interaction** — click handlers, value change handlers
- **Disabled state** — screenshot + verifies click handler isn't triggered
- **Accessibility** — axe-core full-page audit via `@axe-core/playwright`
- **Story-driven** — imports existing stories and renders them (if `.stories.tsx` exists)

| Option | Type | Default | Description |
|---|---|---|---|
| `--componentPath` | `string` | **(required)** | Path to the component file |
| `--project` | `string` | auto-detected | Nx project |
| `--overwrite` | `boolean` | `false` | Overwrite existing test |
| `--dryRun` | `boolean` | `false` | Preview without writing |

### `init` — Initialize the plugin

```bash
npx nx g @effinrich/nx-storybook:init
```

Interactive setup that checks prerequisites and installs missing dependencies.

## Executor

### `watch` — Auto-generate stories on file changes

Add to any project's `project.json`:

```json
{
  "targets": {
    "watch-stories": {
      "executor": "@effinrich/nx-storybook:watch",
      "options": {
        "watchPaths": ["libs/shared/ui/src/lib"],
        "debounceMs": 300
      }
    }
  }
}
```

```bash
npx nx run shared-ui:watch-stories
```

| Option | Type | Default | Description |
|---|---|---|---|
| `watchPaths` | `string[]` | **(required)** | Directories to watch |
| `ignore` | `string[]` | `["*.spec.*", "*.test.*", "*.stories.*", ...]` | Patterns to ignore |
| `debounceMs` | `number` | `300` | Debounce interval |
| `skipInteractionTests` | `boolean` | `false` | Skip interaction tests |

## Auto-detected features

The `story` generator analyzes component source code and adapts output based on what it finds:

| Feature | Detection | Effect |
|---|---|---|
| **React Router** | Imports from `react-router-dom` / `react-router` | Adds `withRouter` decorator |
| **Chakra UI** | Imports from `@chakra-ui/react` | Flagged in report |
| **React Query** | Imports from `@tanstack/react-query` | Flagged in report |
| **Union props** | `'a' \| 'b' \| 'c'` type literals | `select` control + variant stories + screenshot tests |
| **Callback props** | `on*` naming or arrow function types | `action` argType + interaction tests |
| **Children prop** | `children` in props interface | Content in Default story |
| **Disabled prop** | `disabled` / `isDisabled` | Disabled story + disabled screenshot |

## Programmatic API

All generators and utilities are exported for programmatic use:

```typescript
import {
  storyGenerator,
  storiesGenerator,
  componentTestGenerator,
  analyzeComponent,
  generateStoryContent,
  generateInteractionTests,
  generatePlaywrightTest,
} from '@effinrich/nx-storybook'

import type {
  ComponentAnalysis,
  PropInfo,
  ImportInfo,
} from '@effinrich/nx-storybook'
```

## Development

```bash
npx nx build effinrich-nx-storybook    # Build
npx nx test effinrich-nx-storybook     # Run tests (9 suites, 85+ tests)
npx nx g ./tools/forgekit-nx-storybook:story --componentPath=<path> --dryRun
```

## License

MIT
