import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function WithIconColorCheckbox() {
  return (
    <CheckboxRoot iconColor="yellow.400">
      <CheckboxHiddenInput />
      <CheckboxControl />
      <CheckboxLabel>I love Redesign Health</CheckboxLabel>
    </CheckboxRoot>
  )
}
