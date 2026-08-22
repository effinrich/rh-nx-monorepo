import { Stack } from '../../../index'

import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function WithColorSchemeCheckbox() {
  return (
    <Stack>
      <CheckboxRoot defaultChecked colorPalette="red">
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Hello world</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot defaultChecked>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Hello world</CheckboxLabel>
      </CheckboxRoot>
    </Stack>
  )
}
