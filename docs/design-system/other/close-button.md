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

Use the `CloseButton` component to trigger
close functionality in components.

## Import

```js
import { CloseButton } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-closebutton--default&viewMode=story" width="100%" style="border:1px solid black;" ></iframe></div>

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
