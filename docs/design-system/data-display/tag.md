---
id: tag
title: Tag
category: 'data-display'
package: '@redesignhealth/ui'
description: "Tag component is used for items that need to be labeled, categorized, or
organized using keywords that describe them."
---

# Tag

Use the `Tag` component for items that need to be labeled, categorized, or
organized using keywords that describe them.

## Import

Redesign UI exports 5 Tag related components:

- **Tag**: The wrapper for all the tag elements.
- **TagLabel**: The label for tag's text content.
- **TagLeftIcon**: The icon placed on the left side of the tag.
- **TagRightIcon**: The icon placed on the right side of the tag.
- **TagCloseButton**: The close button for the tag.

```js
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton
} from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-tag--color-schemes&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<Tag>Sample Tag</Tag>
```

```jsx
<HStack spacing={4}>
  {['sm', 'md', 'lg'].map(size => (
    <Tag size={size} key={size} variant="solid" colorScheme="teal">
      Teal
    </Tag>
  ))}
</HStack>
```

## With left icon

```jsx
<HStack spacing={4}>
  {['sm', 'md', 'lg'].map(size => (
    <Tag size={size} key={size} variant="subtle" colorScheme="cyan">
      <TagLeftIcon boxSize="12px" as={AddIcon} />
      <TagLabel>Cyan</TagLabel>
    </Tag>
  ))}
</HStack>
```

## With right icon

```jsx
<HStack spacing={4}>
  {['sm', 'md', 'lg'].map(size => (
    <Tag size={size} key={size} variant="outline" colorScheme="blue">
      <TagLabel>Blue</TagLabel>
      <TagRightIcon as={MdSettings} />
    </Tag>
  ))}
</HStack>
```

## With close button

```jsx
<HStack spacing={4}>
  {['sm', 'md', 'lg'].map(size => (
    <Tag
      size={size}
      key={size}
      borderRadius="full"
      variant="solid"
      colorScheme="green"
    >
      <TagLabel>Green</TagLabel>
      <TagCloseButton />
    </Tag>
  ))}
</HStack>
```

## With custom element

```jsx
<Tag size="lg" colorScheme="red" borderRadius="full">
  <Avatar
    src="https://bit.ly/sage-adebayo"
    size="xs"
    name="Segun Adebayo"
    ml={-1}
    mr={2}
  />
  <TagLabel>Segun</TagLabel>
</Tag>
```
