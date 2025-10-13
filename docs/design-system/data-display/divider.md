---
id: divider
title: Divider
category: 'data-display'
package: '@redesignhealth/ui'
description: Dividers are used to visually separate content in a list or group.
---

# Divider

Use the `Divider` component to visually separate content in a list or group.

## Import

```js
import { Divider } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-divider--vertical&viewMode=story" height=200px width="100%" style="border:1px solid black;"></iframe></div>

## Usage

The `Divider` displays a thin horizontal or vertical line, and renders a `hr`
tag.

```jsx
<Divider />
```

### Divider Orientation

Pass the `orientation` prop and set it to either `horizontal` or `vertical`.

```jsx
<Divider orientation="horizontal" />
```

If the vertical orientation is used, make sure that the parent element is
assigned a height.

```jsx
<Center height="50px">
  <Divider orientation="vertical" />
</Center>
```

## Composition

```jsx
<Stack direction="row" h="100px" p={4}>
  <Divider orientation="vertical" />
  <Text>Chakra UI</Text>
</Stack>
```
