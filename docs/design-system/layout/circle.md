---
id: circle
category: layout
title: Center
package: '@redesignhealth/ui'
description: Center is a layout component that centers its child within itself.
---

# Circle

Center is a layout component that centers its child within itself.

## Import

```js
import { Center, Square, Circle } from '@redesignhealth/ui'
```

- **Center:** centers its child given `width` and `height`
- **Square:** centers its child given `size` (width and height)
- **Circle:** a `Square` with round `border-radius`

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?id=components-layout-circle-square--with-circle&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

Put any child element inside it, give it any `width` or/and `height`, it'll
ensure the child is centered.

```jsx
<Center bg="tomato" h="100px" color="white">
  This is the Center
</Center>
```

### With icons

Center can be used to create frames around icons or numbers.

```jsx
<HStack>
  <Center w="40px" h="40px" bg="tomato" color="white">
    <PhoneIcon />
  </Center>
  <Center w="40px" h="40px" bg="tomato" color="white">
    <Box as="span" fontWeight="bold" fontSize="lg">
      1
    </Box>
  </Center>
</HStack>
```

### Square and Circle

To reduce boilerplate, we've exported `Square` and `Circle` components that
automatically centers its children given the `size`.

```jsx
<HStack>
  <Circle size="40px" bg="tomato" color="white">
    <PhoneIcon />
  </Circle>
  <Square size="40px" bg="purple.700" color="white">
    <PhoneIcon />
  </Square>
</HStack>
```
