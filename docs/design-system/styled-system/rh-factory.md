---
category: 'features'
title: 'Redesign UI Factory'
package: '@redesignhealth/ui'
description: Using the Redesign UI Factory and elements
---

# Redesign UI Factory

Redesign UI Factory serves as an **object of rh enabled JSX elements**, and also
**a function that can be used to enable custom component** receive rh's
style props.

```bash
import { rh } from "@redesignhealth/ui"
```

## Redesign JSX Elements

Create base html elements with theme-aware style props using `rh.<element>`
notation. For example, if you want a plain html button with ability to pass
rh styles, you can write `<rh.button />`.

```jsx
<rh.button
  px="3"
  py="2"
  bg="green.200"
  rounded="md"
  _hover={{ bg: 'green.300' }}
>
  Click me
</rh.button>
```

This reduces the need to create custom component wrappers and name them. This
syntax is available for common html elements. See the reference for the full
[list of elements](https://github.com/rh-ui/rh-ui/blob/main/packages/system/src/system.utils.ts#L9)
supported.

```jsx
<rh.h1 fontSize="lg"> Heading </rh.h1>
```

## Redesign UI Factory function

This is a function that converts **non-rh components** or **jsx element** to
rh-enabled components so you can pass style props to them.

Consider a package called `react-input-autoresize`, let's use the Redesign UI Factory
function to make possible to pass style props.

The function will infer the prop types from the wrapped component and also add
rh style props.

```jsx
import { rh } from '@redesignhealth/ui'
import Textarea from 'react-input-autoresize'

const AutoResizeInput = rh(Textarea)

function Example() {
  return <AutoResizeInput bg="red.200" fontSize="12px" />
}
```

> Considering that Redesign uses `emotion` under the hood, ensure the non-rh
> component accepts `className` as props for this to work correctly

### Attaching styles

In some instances, you might need to attach specific styles to the component
wrapped in the Redesign UI Factory

```jsx
const AutoResizeInput = rh(AutoResizeInput, {
  baseStyle: {
    bg: 'papayawhip',
    color: 'red.500'
  }
})
```

You can also use the Redesign UI Factory on jsx elements as well.

```jsx
const Card = rh('div', {
  baseStyle: {
    shadow: 'lg',
    rounded: 'lg',
    bg: 'white'
  }
})
```

### Allowing custom props to be forwarded

By default, the `rh` factory only filters rh related style props from
getting to the DOM. For more fine-grained control of how and what prop should be
forwarded, pass the `shouldForwardProp` option.

Here's a simple example that allows all props (including rh's style props)
to pass through except the `sample` prop.

```jsx
const Div = rh('div', {
  shouldForwardProp: prop => !['sample'].includes(prop)
})
```

Another example that combines the default `shouldForwardProp` from Redesign UI
with custom logic.

```jsx
import { rh, shouldForwardProp } from '@redesignhealth/ui'

const Div = rh('div', {
  shouldForwardProp: prop => {
    // don't forward Redesign's props
    const isRhProp = !shouldForwardProp(prop)
    if (isRhProp) return false

    // else, only forward `sample` prop
    return ['sample'].includes(prop)
  }
})
```

To filter non-HTML attributes, you can leverage
[@emotion/is-prop-valid](https://github.com/emotion-js/emotion/tree/master/packages/is-prop-valid)
package.

```jsx
import isValidHTMLProp from '@emotion/is-prop-valid'
import { rh, shouldForwardProp } from '@redesignhealth/ui'

const Div = rh('div', {
  shouldForwardProp: prop => {
    // don't forward Redesign's props
    const isRhProp = !shouldForwardProp(prop)
    if (isRhProp) return false

    // forward valid HTML props
    const isValidProp = isValidHTMLProp(prop)
    if (isValidProp) return true

    // else, only forward `sample` prop
    return ['sample'].includes(prop)
  }
})
```
