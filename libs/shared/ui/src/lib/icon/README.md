---
id: icon
category: media-and-icons
title: "Icon"
package: "@redesignhealth/ui"
description: "Redesign UI provides a set of commonly used interface icons you can use in your
project"
---

## Installation

Redesign UI provides a set of commonly used interface icons you can use them in your
project.

These icons are published into a separate package that is not part of
`@redesignhealth/ui` by default.

```bash
npm i @redesignhealth/ui
# or
yarn add @redesignhealth/ui
```

## Usage

Redesign UI provides multiple ways to use icons in your project:

- [Installation](#installation)
- [Usage](#usage)
  - [All icons](#all-icons)
- [Using a third-party icon library](#using-a-third-party-icon-library)
  - [Some examples](#some-examples)
- [Creating your custom icons](#creating-your-custom-icons)
  - [Using the `Icon` component](#using-the-icon-component)
  - [Using the `createIcon` function](#using-the-createicon-function)
  - [Tips for generating your own icons](#tips-for-generating-your-own-icons)
- [Fallback Icon](#fallback-icon)

> 🚨 Avoid passing `onClick` handlers to icon components. If you need a
> clickable icon, use the [IconButton](/docs/components/form/icon-button)
> instead.

```jsx
import { PhoneIcon, AddIcon, WarningIcon } from '@redesignhealth/ui'

// The default icon size is 1em (16px)
<PhoneIcon />

// Use the `boxSize` prop to change the icon size
<AddIcon w={6} h={6} />

// Use the `color` prop to change the icon color
<WarningIcon w={8} h={8} color="red.500" />
```

### All icons

Below is a list of all of the icons in the library, along with the corresponding
component names:

<Box mt={5}>
  <IconsList />
</Box>

## Using a third-party icon library

To use third-party icon libraries like
[`react-icons`](https://react-icons.github.io/react-icons/), here are the steps:

1. Import the `Icon` component from `@redesignhealth/ui`
2. Pass the desired third party icon into the `as` prop

```jsx
// 1. Import
import { Icon } from '@redesignhealth/ui'
import { MdSettings } from 'react-icons/md'

// 2. Use the `as` prop
function Example() {
  return <Icon as={MdSettings} />
}
```

### Some examples

```jsx
<HStack>
  {/* The default icon size is 1em (16px) */}
  <Icon as={MdSettings} />

  {/* Use the `boxSize` prop to change the icon size */}
  <Icon as={MdReceipt} w={6} h={6} />

  {/* Use the `color` prop to change the icon color */}
  <Icon as={MdGroupWork} w={8} h={8} color="red.500" />
</HStack>
```

## Creating your custom icons

Redesign UI provides two methods for creating your custom icons:

- Using the [Icon](#using-the-icon-component) component
- Using the [createIcon](#using-the-createicon-function) function

They can be imported from `@redesignhealth/ui`:

```jsx
import { Icon, createIcon } from '@redesignhealth/ui'
```

Both `Icon` and `createIcon` enable you to style the icon using
[style props](/docs/styled-system/style-props).

### Using the `Icon` component

The `Icon` component renders as an `svg` element.

```jsx
<Icon viewBox="0 0 200 200" color="red.500">
  <path
    fill="currentColor"
    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
  />
</Icon>
```

This enables you to define your own custom icon components:

```jsx
const CircleIcon = props => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
)
```

And style them with style props:

```jsx
<HStack>
  {/* The default icon size is 1em (16px) */}
  <CircleIcon />

  {/* Use the `boxSize` prop to change the icon size */}
  <CircleIcon boxSize={6} />

  {/* Use the `color` prop to change the icon color */}
  <CircleIcon boxSize={8} color="red.500" />
</HStack>
```

### Using the `createIcon` function

The `createIcon` function is a convenience wrapper around the process of
generating icons with `Icon`, allowing you to achieve the same functionality
with less effort.

```jsx
import { createIcon } from '@redesignhealth/ui'

// using `path`
export const UpDownIcon = createIcon({
  displayName: 'UpDownIcon',
  viewBox: '0 0 200 200',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  )
})

// OR using the `d` value of a path (the path definition) directly
export const UpDownIcon = createIcon({
  displayName: 'UpDownIcon',
  viewBox: '0 0 200 200',
  d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
})
```

### Tips for generating your own icons

- Export icons as `svg` from [Figma](https://www.figma.com/),
  [Sketch](https://www.sketch.com/), etc.
- Use a tool like [SvgOmg](https://jakearchibald.github.io/svgomg/) to reduce
  the size and minify the markup.

## Fallback Icon

When `children` is not provided, the `Icon` component renders a fallback icon.

```jsx
<Icon />
```
