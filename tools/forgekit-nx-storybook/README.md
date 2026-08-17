# forgekit-nx-storybook

An Nx plugin that automatically generates Storybook stories, interaction tests, Playwright component tests, and accessibility audits for React components.

Analyzes your component's props, imports, and dependencies to produce ready-to-use `.stories.tsx` and `.ct.tsx` files — complete with controls, variant stories, play-function-based interaction tests, visual regression snapshots, and axe-core accessibility checks.

## What makes this different from @nx/storybook?

`@nx/storybook` scaffolds config files (`main.ts`, `preview.ts`, targets). It generates **zero stories**.

**forgekit-nx-storybook** generates everything:

| Feature | @nx/storybook | forgekit-nx-storybook |
|---|:---:|:---:|
| Scaffold .storybook config | Yes | Delegates to @nx/storybook |
| Auto-generate stories from components | - | Yes |
| ArgTypes, controls, default args from props | - | Yes |
| Variant / size / colorPalette stories | - | Yes |
| Interaction tests (play functions) | - | Yes |
| Accessibility audit stories (axe-core) | - | Yes |
| Keyboard navigation tests | - | Yes |
| Co-located Playwright component tests | - | Yes |
| Visual regression snapshots | - | Yes |
| Bulk generation across entire projects | - | Yes |
| Story coverage scoring (A-F grades) | - | Yes |
| File watcher for auto-updates | - | Yes |
| Interactive colored CLI | - | Yes |
| React Router / Chakra / React Query detection | - | Yes |

## Prerequisites

| Requirement | Minimum Version |
|---|---|
| **Node.js** | >= 18.17.1 |
| **Nx** | >= 19.0.0 |
| **Storybook** | >= 8.0.0 |
| **@nx/storybook** | >= 19.0.0 |
| **TypeScript** | >= 5.0.0 |

### @nx/storybook Setup

This plugin requires `@nx/storybook` to be installed and configured in your workspace **before** generating stories. If you haven't set it up yet, run:

```bash
npm install --save-dev @nx/storybook --legacy-peer-deps
npx nx g @nx/storybook:configuration --project=<your-ui-library>
```

> **Tip:** When you run `nx g forgekit-nx-storybook:init`, the plugin will detect if `@nx/storybook` is missing and interactively walk you through installation and project configuration.

### For Playwright component tests

```bash
npm install --save-dev @playwright/experimental-ct-react @axe-core/playwright --legacy-peer-deps
```

## Installation

### From the workspace (local plugin)

```bash
npx nx g ./tools/forgekit-nx-storybook:init
```

### As an npm package

```bash
npx nx add forgekit-nx-storybook
```

The `init` generator runs automatically on `nx add` and will:

1. Check if `@nx/storybook` is installed — if not, prompt to install and configure it
2. Ensure `@storybook/react-vite`, `@storybook/test`, and `storybook` are in your `devDependencies`
3. Display available commands

## Generators

### `story` — Generate a story for one component

```bash
npx nx g forgekit-nx-storybook:story --componentPath=libs/shared/ui/src/lib/button/button.tsx
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
npx nx g forgekit-nx-storybook:stories --project=shared-ui
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
| `--includeComponentTests` | `boolean` | `false` | Also generate Playwright .ct.tsx files |

### `component-test` — Generate a Playwright component test

```bash
npx nx g forgekit-nx-storybook:component-test --componentPath=libs/shared/ui/src/lib/button/button.tsx
```

Produces a co-located `.ct.tsx` file next to the component with:
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
npx nx g forgekit-nx-storybook:init
```

Interactive setup that checks prerequisites and installs missing dependencies.

## Executor

### `watch` — Auto-generate stories on file changes

Add to any project's `project.json`:

```json
{
  "targets": {
    "watch-stories": {
      "executor": "./tools/forgekit-nx-storybook:watch",
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

| Feature | Detection | Effect |
|---|---|---|
| **React Router** | Imports from `react-router-dom` / `react-router` | Adds `withRouter` decorator |
| **Chakra UI** | Imports from `@chakra-ui/react` / `@redesignhealth/ui` | Flagged in report |
| **React Query** | Imports from `@tanstack/react-query` | Flagged in report |
| **Union props** | `'a' \| 'b' \| 'c'` type literals | `select` control + variant stories + screenshot tests |
| **Callback props** | `on*` naming or arrow function types | `action` argType + interaction tests |
| **Children prop** | `children` in props interface | Content in Default story |
| **Disabled prop** | `disabled` / `isDisabled` | Disabled story + disabled screenshot |

## Interactive CLI

All generators produce colorful, structured terminal output:

- Branded banner and step indicators
- Color-coded file operations (`CREATE` / `UPDATE` / `SKIP`)
- Component analysis reports (props, features, generated artifacts)
- Coverage scoring with letter grades
- Interactive prompts during `init`

## Architecture

```
tools/forgekit-nx-storybook/
├── generators.json              # Generator registry (4 generators)
├── executors.json               # Executor registry (1 executor)
├── migrations.json              # Migration registry (for nx migrate)
├── package.json                 # Plugin metadata and peer deps
└── src/
    ├── index.ts                 # Public API exports
    ├── generators/
    │   ├── init/                # Init generator (prerequisite checks)
    │   ├── story/               # Single-component story generator
    │   │   ├── generator.ts
    │   │   └── lib/
    │   │       ├── analyze-component.ts       # Prop extraction, import analysis
    │   │       ├── generate-story-content.ts  # Story file builder
    │   │       └── generate-interaction-tests.ts  # Play functions + a11y
    │   ├── stories/             # Bulk story generator with coverage scoring
    │   └── component-test/      # Playwright component test generator
    │       └── lib/
    │           └── generate-playwright-test.ts
    ├── executors/
    │   └── watch/               # File watcher executor
    └── utils/
        ├── constants.ts
        ├── types.ts
        └── ui.ts                # Colored CLI output (chalk)
```

## Development

```bash
npx nx build forgekit-nx-storybook   # Build
npx nx test forgekit-nx-storybook    # 9 suites, 85+ tests
npx nx g ./tools/forgekit-nx-storybook:story --componentPath=<path> --dryRun
```

## License

MIT
