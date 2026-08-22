import { useState } from 'react'

import { Input } from '../../../index'

import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot
} from '../form-control'

export function WithErrorMessageField() {
  const [input, setInput] = useState('')

  const handleInputChange = (e: { target: { value: string } }) =>
    setInput(e.target.value)

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
