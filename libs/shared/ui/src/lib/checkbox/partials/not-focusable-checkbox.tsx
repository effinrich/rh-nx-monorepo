import { Box } from '../../../index'

import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot
} from '../checkbox'

export function NotFocusableCheckbox() {
  return (
    <Box maxW="300px">
      <CheckboxRoot isFocusable={false}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>not focusable</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot isFocusable={false} disabled>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>
          disabled and not focusable (truly disabled)
        </CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot tabIndex={-1} isFocusable={false}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Not Focusable with provided tabIndex</CheckboxLabel>
      </CheckboxRoot>
    </Box>
  )
}
