# @redesignhealth/ui — Shared UI Library

The Redesign Health component library for React, built on top of [Chakra UI v3](https://www.chakra-ui.com). Consumed by `apps/portal` and other frontend applications in this monorepo.

## Documentation & Storybook

- **Platform Docs:** https://dev-design.redesignhealth.com/platform-documentation-library/platform-intro.html
- **Storybook:** https://dev-design.redesignhealth.com/storybook/shared-ui/index.html
- **Migration Guide:** [MIGRATION.md](./MIGRATION.md) — Chakra UI v2 → v3 changes

## Usage

```tsx
import { Button, Card, CardBody, Input, Modal } from '@redesignhealth/ui'
```

All public components, hooks, and utilities are re-exported from the package root (`libs/shared/ui/src/index.ts`).

## Chakra v3 Compatibility

This library ships backward-compatible shims for components that were renamed or restructured in the Chakra UI v2 → v3 migration:

| v2 name | v3 alias source |
|---------|----------------|
| `Menu` | `MenuRoot` |
| `Accordion` | `AccordionRoot` |
| `Tabs` | `TabsRoot` |
| `Table` | `TableRoot` |
| `List` | `ListRoot` |
| `NumberInput` | `NumberInputRoot` |
| `Slider` | `SliderRoot` |
| `Stepper` / `Step` | `StepsRoot` / `StepsItem` |
| `Modal` | `DialogRoot` |
| `AlertDialog` | `DialogRoot` |
| `Breadcrumb` | `BreadcrumbRoot` |
| `Field` | `FieldRoot` |
| `Img` | `chakra('img')` shim |
| `VisuallyHiddenInput` | `chakra('input')` shim |
| `styled` | `@emotion/styled` |
| `useTheme` | `next-themes` |
| `As` | `React.ElementType` |

`InputGroup` now uses `startElement` and `endElement` props (Chakra v3 API) instead of `InputLeftElement` / `InputRightElement` children.

## Running Locally

```bash
# Run unit tests
nx test shared-ui

# Run Storybook locally
nx storybook shared-ui
```

## Publishing

Run the GitHub Action `.github/workflows/shared-ui-npm-publish.yaml` to publish the version specified in this folder's `package.json` to GitHub Packages:

https://github.com/effinrich/rh-nx-monorepo/pkgs/npm/ui
