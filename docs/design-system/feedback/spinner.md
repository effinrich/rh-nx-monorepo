---
id: spinner
category: feedback
title: Spinner
package: '@redesignhealth/ui'
description:
  Spinners provide a visual cue that an action is processing awaiting a course
  of change or a result.
---

# Spinner

Use the `Spinner` component to provide a visual cue that an action is processing awaiting a course
of change or a result.

## Import

```js
import { Spinner } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-feedback-spinner--basic&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<Spinner />
```

### Spinner with Color

```jsx
<Spinner color="red.500" />
```

### Spinner with different size

```jsx
<Stack direction="row" spacing={4}>
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
</Stack>
```

### Spinner with empty area color

```jsx
<Spinner
  thickness="4px"
  speed="0.65s"
  emptyColor="gray.200"
  color="blue.500"
  size="xl"
/>
```
