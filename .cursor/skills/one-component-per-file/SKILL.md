---
name: one-component-per-file
description: >-
  Extracts extra React components from .tsx and Storybook *.stories.tsx files
  so each file has one component. Places story examples in sibling files or
  partials/, promotes reusable UI into the shared design system, and relocates
  hooks. Use when creating or editing React components, Storybook stories,
  extracting TransitionHooks/BasicUsage/example components from stories, or
  when react/no-multi-comp fires.
---

# One component per file

## When to use

Creating or editing `.tsx` components, Storybook `*.stories.tsx` files, or extracting example/helper components from stories.

## Organization pattern

**ONE COMPONENT per file.**

When a `.tsx` file (especially Storybook `*.stories.tsx`) contains multiple React components used as examples, those must be extracted:

- `TransitionHooks`, `BasicUsage`, `Transition` (and similar story example components) in a stories file should be abstracted to their own files — either:
  - sibling/inline component files next to the main component (e.g. alongside `alert.tsx` / `alert-dialog.tsx`), OR
  - a `partials` directory in that component folder.

- If a extracted component is **reusable** across the design system/app, move it into the shared UI lib (`libs/shared/ui`), not leave it as a story-only inline component.
- Hooks defined in the file, if any, can go in:
  - a `hooks` directory next to the component,
  - the same directory as the component, OR
  - a shared hooks lib (`libs/shared/hooks` or similar) if they are reusable.

## Placement

| Kind | Location | Stories file? | Export from UI lib? |
| --- | --- | --- | --- |
| Design-system / app UI | `libs/shared/ui` (or feature lib) | **Yes** — CI fails if a `type:ui` `.tsx` lacks `*.stories.tsx` | **Yes** |
| Story-only example/helper | sibling file or `partials/` next to the stories file | **No** | **No** |
| Reusable hook | `libs/shared/hooks` or `libs/shared/ui/src/lib/hooks/` | Only if it is a documented UI hook with existing story pattern | Via that lib's index |
| Local hook | `hooks/` next to the component, or same directory | **No** | **No** |

Prefer `partials/` when extracting **two or more** story helpers. One small helper may be a sibling kebab-case file.

Filenames: **kebab-case** (`basic-usage-hooks.tsx`). Enforced by `unicorn/filename-case`.

Do not `eslint-disable react/no-multi-comp`. Extract instead.

## Stories vs exported UI

Extracted **partials/example components used only inside stories** should NOT each get their own stories file unless they are real exported UI components.

Do not create a stories file for every story helper (trips CI in `type:ui` libs). Do not put story helpers onto a `type:ui` export surface (`libs/shared/ui/src/index.ts`) without stories.

## Workflow

1. List every React component in the file (not story CSF exports like `export const BasicUsage = { render: ... }`).
2. Keep the primary exported UI component in the main file (`alert-dialog.tsx`).
3. Move each extra component into a sibling or `partials/` kebab-case file — **one component per file**.
4. Move hooks per the hooks bullets above.
5. If the extracted component is reusable, promote it to `libs/shared/ui`, export it, and add `*.stories.tsx`.
6. If it is story-only, import it from the stories file only. Do not export. Do not add stories.
7. Stories stay co-located: `alert-dialog.stories.tsx` next to `alert-dialog.tsx`.

## Stack (this monorepo)

- Portal is Nx React + react-router-dom, not Next.js. Do not apply Next.js `"use client"` / App Router patterns to portal.
- Shared design system lives in `libs/shared/ui` (kebab-case filenames).
- Chakra UI v2 → v3 is a full migrate, not a compatibility layer. No v2 shims. Import from `@chakra-ui/react`; use `open` not `isOpen`, `colorPalette` not `colorScheme`. Follow the Chakra v3 project rule for the rest.

In other repos, map `libs/shared/ui` and `libs/shared/hooks` to the local design-system and hooks libraries.

## Additional resources

- For the alert-dialog extraction target, see [examples.md](examples.md)
