# @redesignhealth/shared-utils

General-purpose utility functions shared across Redesign Health frontend applications.

## Exports

| Function | Description |
|----------|-------------|
| `cx(...classNames)` | Joins class names, filtering out falsy values |
| `isObject(value)` | Type guard — returns `true` if the value is a non-array object or function |
| `warn({ condition, message })` | Logs a warning to the console in development mode |
| `runIfFn(valueOrFn, ...args)` | Calls `valueOrFn` with `args` if it is a function, otherwise returns it as-is |
| `dataAttr(condition)` | Returns `''` or `undefined` for use as an HTML `data-*` attribute |
| `ariaAttr(condition)` | Returns `true` or `undefined` for use as an ARIA attribute |
| `callAllHandlers(...fns)` | Merges multiple event handlers into one, stopping propagation if `defaultPrevented` |
| `callAll(...fns)` | Merges multiple functions that share the same argument into one |
| `getInitials(userName)` | Extracts uppercased initials from a full name string |
| `base64urlToBase64(str)` | Converts a base64url-encoded string to standard base64 |
| `stripTags(html)` | Strips HTML tags from a string |

## Usage

```ts
import { cx, getInitials, stripTags } from '@redesignhealth/shared-utils'

cx('btn', isActive && 'btn--active')  // 'btn btn--active'
getInitials('Jane Doe')               // 'JD'
stripTags('<p>Hello <b>world</b></p>') // 'Hello world'
```

## Running Tests

```bash
nx test shared-utils
```
