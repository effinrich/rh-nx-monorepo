# @redesignhealth/portal/ui

Portal-specific UI components used across multiple feature libraries within the Platform Portal. Built on `@redesignhealth/ui` (Chakra v3).

## What's in Here

Reusable presentational components that are scoped to the portal domain but shared between features:

- **List cards** — `ListCard`, `ListCardRow`, `ListCardHeader` — standardized row/card layouts for entity lists
- **Filter box** — search input and filter controls used on listing pages
- **Selection box** — searchable multi-select UI for entity pickers
- **Section header** — page / section title bar with optional action slot
- **Group popover** — popover for grouping/categorizing items
- **Pages** — shared page-level layouts:
  - `ResearchHubPage` — research sprint and call notes forms
  - `VendorReferencesPage` — vendor form with date picker
- **Secondary text** — styled muted text component

## Usage

```tsx
import { ListCard, SectionHeader, FilterBox } from '@redesignhealth/portal/ui'
```

## Running Tests

```bash
nx test portal-ui
```
