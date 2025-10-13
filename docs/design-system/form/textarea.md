---
id: textarea
category: form
title: Textarea
package: '@redesignhealth/ui'
description: 'The Textarea component allows you to easily create multi-line text inputs.'
---

# Textarea

Use the `Textarea` component to easily create multi-line text inputs.

## Import

```js
import { Textarea } from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-forms-textarea--basic&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<Textarea placeholder="Here is a sample placeholder" />
```

### Controlled Textarea

```jsx
function Example() {
  let [value, setValue] = React.useState('')

  let handleInputChange = e => {
    let inputValue = e.target.value
    setValue(inputValue)
  }
  return (
    <>
      <Text mb="8px">Value: {value}</Text>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Here is a sample placeholder"
        size="sm"
      />
    </>
  )
}
```

### Resize behavior

You can add `resize` prop to change the `Textarea` resize behavior.

```jsx
function ResizeExample() {
  const [resize, setResize] = React.useState('horizontal')

  return (
    <>
      <RadioGroup defaultValue={resize} onChange={setResize} mb={6}>
        <Stack direction="row" spacing={5}>
          <Radio value="horizontal">Horizontal</Radio>
          <Radio value="vertical">Vertical</Radio>
          <Radio value="none">None</Radio>
        </Stack>
      </RadioGroup>

      <Textarea
        placeholder="Here is a sample placeholder"
        size="sm"
        resize={resize}
      />
    </>
  )
}
```

### Disabled Textarea

```jsx
<Textarea isDisabled placeholder="Here is a sample placeholder" />
```

### Invalid Textarea

```jsx
<Textarea isInvalid placeholder="Here is a sample placeholder" />
```
