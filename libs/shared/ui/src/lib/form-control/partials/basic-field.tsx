import { Input } from '../../../index'

import { FieldHelperText, FieldLabel, FieldRoot } from '../form-control'

export function BasicField() {
  return (
    <FieldRoot>
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FieldLabel>Email address</FieldLabel>
      <Input type="email" />
      {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
      <FieldHelperText>We'll never share your email.</FieldHelperText>
    </FieldRoot>
  )
}
