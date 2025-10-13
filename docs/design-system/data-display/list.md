---
id: list
title: List
category: 'data-display'
package: '@redesignhealth/ui'
description: 'List is used to display list items. It renders a <ul> element by default.'
---

# List

Use the `List` component to display list items. It renders a `<ul>` element by default.

## Import

```js
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList
} from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-list--unordered&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Unordered List

```jsx
<UnorderedList>
  <ListItem>Lorem ipsum dolor sit amet</ListItem>
  <ListItem>Consectetur adipiscing elit</ListItem>
  <ListItem>Integer molestie lorem at massa</ListItem>
  <ListItem>Facilisis in pretium nisl aliquet</ListItem>
</UnorderedList>
```

## Ordered List

```jsx
<OrderedList>
  <ListItem>Lorem ipsum dolor sit amet</ListItem>
  <ListItem>Consectetur adipiscing elit</ListItem>
  <ListItem>Integer molestie lorem at massa</ListItem>
  <ListItem>Facilisis in pretium nisl aliquet</ListItem>
</OrderedList>
```

## Unstyled List with icon

Add icons to the list items by using the `ListIcon` component. You can pass the
name of the icon or use custom icons. The size of the icon is relative to the
font size of the list item.

```jsx
<List spacing={3}>
  <ListItem>
    <ListIcon as={MdCheckCircle} color="green.500" />
    Lorem ipsum dolor sit amet, consectetur adipisicing elit
  </ListItem>
  <ListItem>
    <ListIcon as={MdCheckCircle} color="green.500" />
    Assumenda, quia temporibus eveniet a libero incidunt suscipit
  </ListItem>
  <ListItem>
    <ListIcon as={MdCheckCircle} color="green.500" />
    Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
  </ListItem>
  {/* You can also use custom icons from react-icons */}
  <ListItem>
    <ListIcon as={MdSettings} color="green.500" />
    Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
  </ListItem>
</List>
```
