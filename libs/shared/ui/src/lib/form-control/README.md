---
id: form-control
category: form
title: Form Control
package: '@redesignhealth/ui'
description:
  Form Control provides context such as `isInvalid`, `isDisabled`, and
  `isRequired` to form elements
---

# Form Control

## Import

Redesign Health UI exports 4 components for Form Control:

- **`FormControl`**: The wrapper that provides context and functionality for all
  children.
- **`FormLabel`**: The label of a form section. The usage is similar to
  [html label](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).
  `htmlFor` is set by default for children input.
- **`FormHelperText`**: The message that tells users more details about the form
  section.
- **`FormErrorMessage`**: The message that shows up when an error occurs.

```js
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText
} from '@redesignhealth/ui'
```

## Usage

```jsx
<FormControl>
  <FormLabel>Email address</FormLabel>
  <Input type="email" />
  <FormHelperText>We'll never share your email.</FormHelperText>
</FormControl>
```

### Sample usage for a radio or checkbox group

```jsx
<FormControl as="fieldset">
  <FormLabel as="legend">Favorite Naruto Character</FormLabel>
  <RadioGroup defaultValue="Itachi">
    <HStack spacing="24px">
      <Radio value="Sasuke">Sasuke</Radio>
      <Radio value="Nagato">Nagato</Radio>
      <Radio value="Itachi">Itachi</Radio>
      <Radio value="Sage of the six Paths">Sage of the six Paths</Radio>
    </HStack>
  </RadioGroup>
  <FormHelperText>Select only if you're a fan.</FormHelperText>
</FormControl>
```

### Error message

`FormErrorMessage` will only show up when the property `isInvalid` in
`FormControl` is true.

```jsx
function errorMessageExample() {
  const [input, setInput] = useState('')

  const handleInputChange = e => setInput(e.target.value)

  const isError = input === ''

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Email</FormLabel>
      <Input type="email" value={input} onChange={handleInputChange} />
      {!isError ? (
        <FormHelperText>
          Enter the email you'd like to receive the newsletter on.
        </FormHelperText>
      ) : (
        <FormErrorMessage>Email is required.</FormErrorMessage>
      )}
    </FormControl>
  )
}
```

### Making a field required

By passing the `isRequired` props, the `Input` field has `aria-required` set to
`true`, and the `FormLabel` will show a red asterisk. This red asterisk can be
overwritten by passing `requiredIndicator` to the `FormLabel`. If you want to
indicate that a field is optional you can add `optionalIndicator` to the
`FormLabel`

```jsx
<FormControl isRequired>
  <FormLabel>First name</FormLabel>
  <Input placeholder="First name" />
</FormControl>
```

### Select Example

```jsx
<FormControl>
  <FormLabel>Country</FormLabel>
  <Select placeholder="Select country">
    <option>United Arab Emirates</option>
    <option>Nigeria</option>
  </Select>
</FormControl>
```

### Number Input Example

```jsx
<FormControl>
  <FormLabel>Amount</FormLabel>
  <NumberInput max={50} min={10}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
</FormControl>
```

### Usage with Form Libraries

Form Libraries like [Formik](https://jaredpalmer.com/formik/) make it soooo easy
to manage form state and validation. I 💖 Formik

```jsx
// The below import defines which components come from formik
// import { Field, Form, Formik } from 'formik';

function FormikExample() {
  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱"
    }
    return error
  }

  return (
    <Formik
      initialValues={{ name: 'Sasuke' }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
      }}
    >
      {props => (
        <Form>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>First name</FormLabel>
                <Input {...field} placeholder="name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}
```
