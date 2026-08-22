import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function DisabledCheckbox() {
  return (
    <CheckboxRoot disabled>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>Disabled</CheckboxLabel>
    </CheckboxRoot>
  )
}
