import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function BasicCheckbox() {
  return (
    <CheckboxRoot colorPalette="red">
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>Hello</CheckboxLabel>
    </CheckboxRoot>
  )
}
