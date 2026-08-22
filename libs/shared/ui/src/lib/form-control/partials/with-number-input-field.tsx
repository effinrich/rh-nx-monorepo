import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from '@chakra-ui/react'

import { FieldLabel, FieldRoot } from '../form-control'

export function WithNumberInputField() {
  return (
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
}
