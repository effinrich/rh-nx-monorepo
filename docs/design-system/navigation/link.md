---
id: link
category: navigation
title: Link
package: '@redesignhealth/ui'
description: Link is an accessible element for navigation
---

# Link

Link is an accessible element for navigation.

## Imports

```js
import { ExternalLinkIcon, Link } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-navigation-link--default&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<Link>Redesign UI</Link>
```

### External Link

```jsx
<Link href="https://redesignhealth.com" isExternal>
  Redesign Health design system <ExternalLinkIcon mx="2px" />
</Link>
```

### Link inline with text

```jsx
<Text>
  Did you know that{' '}
  <Link color="teal.500" href="#">
    links can live inline with text
  </Link>
</Text>
```

## Usage with Routing Library

To use the `Link` with a routing library like Reach Router or React Router, all
you need to do is pass the `as` prop. It'll replace the rendered `a` tag with
Reach's `Link`.

```jsx
// 1. import { Link as ReachLink } from "@reach/router"

// 2. Then use it like this
<Link as={ReachLink} to="/home">
  Home
</Link>
```

## Usage with Next.js

To use the `Link` with Next.js, all you need to do is to wrap `Link` with
Next.js `Link` component and pass the `passHref` prop. `passHref` Forces Next.js
`Link` to send the `href` property to its child.

```jsx
// 1. import NextLink from "next/link"

// 2. Then use it like this
<NextLink href="/home" passHref>
  <Link>Home</Link>
</NextLink>
```

### Next.js 13

As of Next.js 13, the `Link` component directly renders an `a` element,
therefore its child can no longer be another `a` element. One way to use the new
`Link` component with Redesign UI's `Link` component is to pass a `legacyBehavior`
prop to the Next.js's link to opt out of the new behavior, and also the
`passHref` prop to pass down the `href` to the Redesign UI link:

```jsx
import NextLink from 'next/link'
import { Link, Heading } from '@redesignhealth/ui'
...
<NextLink href='...' legacyBehavior passHref>
  <Link>
    <Heading>...</Heading>
  </Link>
</NextLink>
```

Another way to style the new Next.js `Link` component is to create a custom
component using the Redesign UI Factory function:

```jsx
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { rh } from '@redesignhealth/ui'

// wrap the NextLink with Redesign UI's factory function
const MagicLink = rh<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: (prop) => ['href', 'target', 'children', ...].includes(prop),
})

// use the MagicLink just like you'd use the ordinary Redesign UI link
<MagicLink
  href='...'
  color='...'
  target='...'
>
  ...
</MagicLink>
```
