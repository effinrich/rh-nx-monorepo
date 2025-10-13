---
id: switch
category: form
title: Switch
package: '@redesignhealth/ui'
description: 'The Switch component is used as an alternative for the checkbox component.'
---

# Switch

Use the `Switch` component as an alternative for the
`Checkbox` component. You can switch between
enabled or disabled states.

`Switch` must always be accompanied by a label, and follows the same keyboard
workflow as a `Checkbox`.

## Import

```js
import { Switch } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-forms-switch--usage&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<FormControl display="flex" alignItems="center">
  <FormLabel htmlFor="email-alerts" mb="0">
    Enable email alerts?
  </FormLabel>
  <Switch id="email-alerts" />
</FormControl>
```

## Sizes

Pass the `size` prop to change the size of the `Switch`.

```jsx
<Stack align="center" direction="row">
  <Switch size="sm" />
  <Switch size="md" />
  <Switch size="lg" />
</Stack>
```

## Switch background color

You can change the checked background color of the `Switch` by passing the
`colorScheme` prop.

```jsx
<Stack direction="row">
  <Switch colorScheme="red" />
  <Switch colorScheme="teal" size="lg" />
</Stack>
```

## State depending behavior

States like `isDisabled` have an impact on the usability of a `Switch` and on
the styles, except for the `isInvalid` and the `isRequired` prop.

```jsx
<FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
  <FormLabel htmlFor="isChecked">isChecked:</FormLabel>
  <Switch id="isChecked" isChecked />

  <FormLabel htmlFor="isDisabled">isDisabled:</FormLabel>
  <Switch id="isDisabled" isDisabled defaultChecked />

  <FormLabel htmlFor="isFocusable">isFocusable:</FormLabel>
  <Switch id="isFocusable" isFocusable isDisabled />

  <FormLabel htmlFor="isInvalid">isInvalid:</FormLabel>
  <Switch id="isInvalid" isInvalid />

  <FormLabel htmlFor="isReadOnly">isReadOnly:</FormLabel>
  <Switch id="isReadOnly" isReadOnly />

  <FormLabel htmlFor="isRequired">isRequired:</FormLabel>
  <Switch id="isRequired" isRequired />
</FormControl>
```
