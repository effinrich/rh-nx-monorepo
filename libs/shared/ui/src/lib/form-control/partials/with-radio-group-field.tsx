import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot
} from '@chakra-ui/react'

import { HStack } from '../../../index'

import { FieldHelperText, FieldLabel, FieldRoot } from '../form-control'

export function WithRadioGroupField() {
  return (
    <FieldRoot as="fieldset">
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FieldLabel as="legend">Favorite Naruto Character</FieldLabel>
      <RadioGroupRoot defaultValue="Itachi">
        <HStack gap="24px">
          <RadioGroupItem value="Sasuke">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>Sasuke</RadioGroupItemText>
          </RadioGroupItem>
          <RadioGroupItem value="Nagato">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>Nagato</RadioGroupItemText>
          </RadioGroupItem>
          <RadioGroupItem value="Itachi">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>Itachi</RadioGroupItemText>
          </RadioGroupItem>
          <RadioGroupItem value="Sage of the six Paths">
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>Sage of the six Paths</RadioGroupItemText>
          </RadioGroupItem>
        </HStack>
      </RadioGroupRoot>
      {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
      <FieldHelperText>Select only if you're a fan.</FieldHelperText>
    </FieldRoot>
  )
}
