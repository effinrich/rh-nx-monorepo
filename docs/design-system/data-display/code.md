---
id: code
title: Code
category: 'data-display'
package: '@redesignhealth/ui'
description:
  Code is a component used to display inline code. It is composed from the Box
  component with a font family of `mono` for displaying code.
---

# Code

Use the `Code` component to display inline code. It is composed from the Box component with a font family of `mono` for displaying code.

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-code--default&viewMode=story"  height=60px width="100%" style="border:1px solid black;"></iframe></div>

## Import

```js
import { Code } from '@redesignhealth/ui'
```

## Usage

```jsx
<Code>Hello world</Code>
```

### Colors

You can change the color scheme of the component by passing the `colorScheme`
prop.

```jsx
<Stack direction="row">
  <Code children="console.log(welcome)" />
  <Code colorScheme="red" children="var redesign = 'awesome!'" />
  <Code colorScheme="yellow" children="npm install redesign" />
</Stack>
```
