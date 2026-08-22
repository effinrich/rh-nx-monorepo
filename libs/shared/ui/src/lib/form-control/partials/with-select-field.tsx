import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react'

import { FieldLabel, FieldRoot } from '../form-control'

export function WithSelectField() {
  return (
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
}
