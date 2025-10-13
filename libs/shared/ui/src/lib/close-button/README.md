---
id: close-button
category: other
title: Close Button
package: '@redesignhealth/ui'
description:
  CloseButton is essentially a button with a close icon. It is used to trigger
  close functionality in components.
---

# Close Button

## Import

```js
import { CloseButton } from '@redesignhealth/ui'
```

## Usage

```jsx
<CloseButton />
```

### Button Size

Pass the `size` prop to adjust the size of the close button. Values can be `sm`,
`md` or `lg`.

```jsx
<Stack direction="row" spacing={6}>
  <CloseButton size="sm" />
  <CloseButton size="md" />
  <CloseButton size="lg" />
</Stack>
```
