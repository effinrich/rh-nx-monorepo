---
title: 'useTheme'
package: '@redesignhealth/hooks'
description: 'React hook to get access to theme by reading from theme context'
---

# useTheme

`useTheme` is a custom hook used to get the theme object from context.

## Import

```js
import { useTheme } from '@redesignhealth/hooks'
```

## Return value

The `useTheme` hook returns the theme object.

## Usage

```jsx
function Example() {
  const theme = useTheme()

  return <div>{/* Do something with the theme */}</div>
}
```
