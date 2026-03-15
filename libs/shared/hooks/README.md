# @redesignhealth/shared-hooks

Shared React hooks for use across Redesign Health frontend applications.

## Exports

### `usePagination`

A hook for managing paginated API state — tracks current page, page size, and provides helpers for navigating between pages. Used alongside React Query list queries that return a paginated response envelope.

```ts
import { usePagination } from '@redesignhealth/shared-hooks'

const { page, pageSize, setPage, setPageSize } = usePagination()
```

## Running Tests

```bash
nx test shared-hooks
```
