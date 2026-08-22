import { Input } from '../../../index'

import { FieldLabel, FieldRoot } from '../form-control'

export function WithRequiredFieldField() {
  return (
    <FieldRoot required>
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FieldLabel>First name</FieldLabel>
      <Input placeholder="First name" />
    </FieldRoot>
  )
}
