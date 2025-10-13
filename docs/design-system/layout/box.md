---
id: box
category: layout
title: Box
package: '@redesignhealth/ui'
description:
  Box is the most abstract component on top of which all other Redesign UI
  components are built. By default, it renders a `div` element
---

# Box

The `Box` component is the most abstract component on top of which all other Redesign UI
components are built. By default, it renders a `div` element

## Import

```js
import { Box } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-layout-box--basic&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

The Box component is useful because it helps with three common use cases:

- Create responsive layouts with ease.
- Provide a shorthand way to pass styles via props (`bg` instead of
  `backgroundColor`).
- Compose new component and allow for override using the `as` prop.

```jsx
<Box bg="tomato" w="100%" p={4} color="white">
  This is the Box
</Box>
```

### Airbnb example

```jsx
function AirbnbCard() {
  const property = {
    imageUrl: 'https://bit.ly/2Z4KKcF',
    imageAlt: 'Rear view of modern home with pool',
    beds: 3,
    baths: 2,
    title: 'Modern home in city center in the heart of historic Los Angeles',
    formattedPrice: '$1,900.00',
    reviewCount: 34,
    rating: 4
  }

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={property.imageUrl} alt={property.imageAlt} />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {property.beds} beds &bull; {property.baths} baths
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {property.title}
        </Box>

        <Box>
          {property.formattedPrice}
          <Box as="span" color="gray.600" fontSize="sm">
            / wk
          </Box>
        </Box>

        <Box display="flex" mt="2" alignItems="center">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? 'teal.500' : 'gray.300'}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {property.reviewCount} reviews
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
```

### as prop

You can use the `as` prop to change the element render, just like
styled-components.

```jsx
<Box as="button" borderRadius="md" bg="tomato" color="white" px={4} h={8}>
  Button
</Box>
```
