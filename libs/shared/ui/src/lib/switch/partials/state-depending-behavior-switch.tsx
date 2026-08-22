import { FieldLabel, FieldRoot, SimpleGrid } from '../../../index'

import { Switch } from '../switch'

export function StateDependingBehaviorSwitch() {
  return (
    <FieldRoot as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
      <FieldLabel htmlFor="isChecked">isChecked:</FieldLabel>
      <Switch id="isChecked" checked />

      <FieldLabel htmlFor="isDisabled">isDisabled:</FieldLabel>
      <Switch id="isDisabled" disabled defaultChecked />

      <FieldLabel htmlFor="isFocusable">isFocusable:</FieldLabel>
      <Switch id="isFocusable" isFocusable disabled />

      <FieldLabel htmlFor="isInvalid">isInvalid:</FieldLabel>
      <Switch id="isInvalid" invalid />

      <FieldLabel htmlFor="isReadOnly">isReadOnly:</FieldLabel>
      <Switch id="isReadOnly" readOnly />

      <FieldLabel htmlFor="isRequired">isRequired:</FieldLabel>
      <Switch id="isRequired" required />
    </FieldRoot>
  )
}
