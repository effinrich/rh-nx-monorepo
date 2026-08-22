import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function ReadonlyCheckbox() {
  return (
    <CheckboxRoot readOnly>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>Readonly</CheckboxLabel>
    </CheckboxRoot>
  )
}
