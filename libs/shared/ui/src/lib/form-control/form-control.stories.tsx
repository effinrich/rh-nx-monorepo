/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import {
  NumberInputRoot,
  NumberInputInput,
  NumberInputControl,
  NumberInputIncrementTrigger,
  NumberInputDecrementTrigger,
  RadioGroupRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  NativeSelectRoot,
  NativeSelectField
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

import { Meta } from '@storybook/react-vite'

import { Button, Container, HStack, Input } from '../../index'

import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot
} from './form-control'

export default {
  component: FieldRoot,
  title: 'Components / Forms / FormControl',
  decorators: [Story => <Container>{Story()}</Container>]
} as Meta

export const Basic = () => (
  <FieldRoot>
    {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
    <FieldLabel>Email address</FieldLabel>
    <Input type="email" />
    {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
    <FieldHelperText>We'll never share your email.</FieldHelperText>
  </FieldRoot>
)

export const WithRadioGroup = () => {
  return (
    <FieldRoot as="fieldset">
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FieldLabel as="legend">Favorite Naruto Character</FieldLabel>
      <RadioGroupRoot defaultValue="Itachi">
        <HStack gap="24px">
          <RadioGroupItem value="Sasuke"><RadioGroupItemHiddenInput /><RadioGroupItemControl /><RadioGroupItemText>Sasuke</RadioGroupItemText></RadioGroupItem>
          <RadioGroupItem value="Nagato"><RadioGroupItemHiddenInput /><RadioGroupItemControl /><RadioGroupItemText>Nagato</RadioGroupItemText></RadioGroupItem>
          <RadioGroupItem value="Itachi"><RadioGroupItemHiddenInput /><RadioGroupItemControl /><RadioGroupItemText>Itachi</RadioGroupItemText></RadioGroupItem>
          <RadioGroupItem value="Sage of the six Paths"><RadioGroupItemHiddenInput /><RadioGroupItemControl /><RadioGroupItemText>Sage of the six Paths</RadioGroupItemText></RadioGroupItem>
        </HStack>
      </RadioGroupRoot>
      {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
      <FieldHelperText>Select only if you're a fan.</FieldHelperText>
    </FieldRoot>
  )
}

export const WithErrorMessage = () => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: any) => setInput(e.target.value)

  const isError = input === ''

  return (
    <FieldRoot invalid={isError}>
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FieldLabel>Email</FieldLabel>
      <Input type="email" value={input} onChange={handleInputChange} />
      {!isError ? (
        // @ts-expect-error Chakra v3 FieldHelperText children typing
        <FieldHelperText>
          Enter the email you'd like to receive the newsletter on.
        </FieldHelperText>
      ) : (
        // @ts-expect-error Chakra v3 FieldErrorText children typing
        <FieldErrorText>Email is required.</FieldErrorText>
      )}
    </FieldRoot>
  )
}

export const WithRequiredField = () => (
  <FieldRoot required>
    {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
    <FieldLabel>First name</FieldLabel>
    <Input placeholder="First name" />
  </FieldRoot>
)

export const WithSelect = () => (
  <FieldRoot>
    {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
    <FieldLabel>Country</FieldLabel>
    <NativeSelectRoot>
      <NativeSelectField placeholder="Select country">
        <option>United Arab Emirates</option>
        <option>Nigeria</option>
      </NativeSelectField>
    </NativeSelectRoot>
  </FieldRoot>
)

export const WithNumberInput = () => (
  <FieldRoot>
    {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
    <FieldLabel>Amount</FieldLabel>
    <NumberInputRoot max={50} min={10}>
      <NumberInputInput />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  </FieldRoot>
)

export const WithFormik = () => {
  function validateName(value: any) {
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
            {({ field, form }: any) => (
              <FieldRoot invalid={form.errors.name && form.touched.name}>
                {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
                <FieldLabel>First name</FieldLabel>
                <Input {...field} placeholder="name" />
                {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
                <FieldErrorText>{form.errors.name}</FieldErrorText>
              </FieldRoot>
            )}
          </Field>
          <Button
            mt={4}
            colorPalette="primary"
            loading={props.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}
