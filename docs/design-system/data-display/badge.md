---
id: badge
title: Badge
category: 'data-display'
package: '@redesignhealth/ui'
description: Badges are used to highlight an item's status for quick recognition.
---

# Badge

Use the `Badge` component to highlight an item's status for quick recognition.

## Import

```js
import { Badge } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-badge--subtle-badges&viewMode=story" height=100px width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<Badge>Default</Badge>
```

### Badge Color

Pass the `colorScheme` prop to customize the color of the Badge. `colorScheme`
can be any **color key** that exists in `theme.colors`.
[Learn more about theming](/docs/styled-system/theme).

```jsx
<Stack direction="row">
  <Badge>Default</Badge>
  <Badge colorScheme="success">Success</Badge>
  <Badge colorScheme="red">Removed</Badge>
  <Badge colorScheme="purple">New</Badge>
</Stack>
```

### Badge Variants

Pass the `variant` prop and set it to either `subtle`, `solid`, or `outline` to
get a different style.

```jsx
<Stack direction="row">
  <Badge variant="outline" colorScheme="green">
    Default
  </Badge>
  <Badge variant="solid" colorScheme="green">
    Success
  </Badge>
  <Badge variant="subtle" colorScheme="green">
    Removed
  </Badge>
</Stack>
```

## Composition

```jsx
<Flex>
  <Avatar src="https://bit.ly/sage-adebayo" />
  <Box ml="3">
    <Text fontWeight="bold">
      Segun Adebayo
      <Badge ml="1" colorScheme="green">
        New
      </Badge>
    </Text>
    <Text fontSize="sm">UI Engineer</Text>
  </Box>
</Flex>
```

You can also change the size of the badge by passing the `fontSize` prop.

```jsx
<Text fontSize="xl" fontWeight="bold">
  Segun Adebayo
  <Badge ml="1" fontSize="0.8em" colorScheme="green">
    New
  </Badge>
</Text>
```
