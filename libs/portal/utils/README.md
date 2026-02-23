# @redesignhealth/portal/utils

Portal-specific utility functions and helpers used across the Platform Portal's feature libraries.

## Exports

| Module | Description |
|--------|-------------|
| `auth` | Authentication helpers (token parsing, redirect logic) |
| `axios` | Portal Axios instance configuration |
| `date` | Date formatting and manipulation helpers |
| `filters` | URL query-param ↔ filter-state serialization helpers |
| `form-helpers` | Shared React Hook Form utilities and transformers |
| `has-role` | Role-checking predicate functions |
| `modal` | Helpers for programmatic modal state management |
| `perms` | Permission and access-control helpers |
| `roles` | Role constants and display-name mappings |
| `scroll` | Scroll-to-top and scroll-restoration helpers |
| `search` | Debounced search query helpers |
| `select` | React Select option-transformer utilities |
| `tab` | Tab-state URL sync helpers |
| `user` | User display name, avatar, and profile helpers |
| `zod` | Shared Zod schemas and validation helpers |

## Usage

```ts
import { hasRole, formatDate, buildFilterParams } from '@redesignhealth/portal/utils'
```

## Running Tests

```bash
nx test portal-utils
```
