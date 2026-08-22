import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function InvalidCheckbox() {
  return (
    <CheckboxRoot invalid>
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>Invalid</CheckboxLabel>
    </CheckboxRoot>
  )
}
