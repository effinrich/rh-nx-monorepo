import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function WithIconColorCheckbox() {
  return (
    <CheckboxRoot>
      <CheckboxHiddenInput />
      <CheckboxControl>
        <CheckboxIndicator color="yellow.400" />
      </CheckboxControl>
      <CheckboxLabel>I love Redesign Health</CheckboxLabel>
    </CheckboxRoot>
  )
}
