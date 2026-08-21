# Example: alert-dialog stories

Canonical source (do not treat current inline helpers as the end state):

`libs/shared/ui/src/lib/alert-dialog/alert-dialog.stories.tsx`

That stories file currently defines extra components in the same file (`BasicUsageHooks`, `TransitionHooks`) plus CSF story exports (`BasicUsage`, `Transition`). Extract the **components**, not the CSF objects.

Sibling `alert/` shows the other side of the pattern: `alert.tsx` is the exported UI; `alert.stories.tsx` is co-located; `icons.tsx` is a sibling file — not a story-only partial.

## Target layout

```
libs/shared/ui/src/lib/alert-dialog/
  alert-dialog.tsx                 # exported UI — already has stories
  alert-dialog.stories.tsx         # CSF only; imports helpers
  alert-dialog.spec.tsx
  partials/
    basic-usage-hooks.tsx          # story-only — NO .stories.tsx, NOT in src/index.ts
    transition-hooks.tsx           # story-only — NO .stories.tsx, NOT in src/index.ts
```

One helper could instead be a sibling (`basic-usage-hooks.tsx` next to `alert-dialog.tsx`). Prefer `partials/` here because there are two.

## After extraction (stories file)

Stories file keeps Meta + CSF exports only:

```tsx
import { Meta } from '@storybook/react-vite'

import { AlertDialogRoot } from './alert-dialog'
import { BasicUsageHooks } from './partials/basic-usage-hooks'
import { TransitionHooks } from './partials/transition-hooks'

export default {
  component: AlertDialogRoot,
  title: 'Components / Overlay / Alert Dialog'
} as Meta<typeof AlertDialogRoot>

export const BasicUsage = {
  render: (args: Record<string, unknown>) => <BasicUsageHooks {...args} />
}

export const Transition = {
  render: (args: Record<string, unknown>) => <TransitionHooks {...args} />
}
```

`partials/basic-usage-hooks.tsx` and `partials/transition-hooks.tsx` each export **one** component. They are not added to `libs/shared/ui/src/index.ts`. They do not get `basic-usage-hooks.stories.tsx`.

## Promote only if reusable

If `BasicUsageHooks` became a real dialog pattern used in apps, then:

1. Move it to `libs/shared/ui` as its own kebab-case component folder.
2. Export from `libs/shared/ui/src/index.ts`.
3. Add a co-located `*.stories.tsx` (required for `type:ui`).

Until then, leave it as a story-only partial.
