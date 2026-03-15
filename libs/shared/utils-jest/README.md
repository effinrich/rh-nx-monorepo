# @redesignhealth/shared-utils-jest

Test utilities for Jest and Vitest used across Redesign Health frontend libraries. Provides a pre-configured `render` helper, common mocks, and re-exports from `@testing-library/react`.

## Exports

| Export | Description |
|--------|-------------|
| `render` | Custom render function with all required providers (Chakra, React Query, Router, etc.) pre-wrapped |
| `focus(element)` / `blur(element)` | Focus / blur helpers for accessibility tests |
| `act`, `fireEvent`, `screen`, `waitFor` | Re-exported from `@testing-library/react` |
| Mocks | `mockCookie`, `mockAxios`, `mockMatchMedia`, `mockImage`, `mockLocalStorage` — browser API mocks for use in `beforeEach` / `afterEach` |
| Hook utilities | Helpers for testing React hooks |

## Usage

```ts
import { render, screen, fireEvent } from '@redesignhealth/shared-utils-jest'
import { MyComponent } from './MyComponent'

it('renders correctly', () => {
  render(<MyComponent />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

## Running Tests

```bash
nx test shared-utils-jest
```
