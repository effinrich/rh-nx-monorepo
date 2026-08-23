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
      <CheckboxRoot>
        <CheckboxHiddenInput tabIndex={-1} />
        <CheckboxControl />
        <CheckboxLabel>not focusable</CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot disabled>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>
          disabled and not focusable (truly disabled)
        </CheckboxLabel>
      </CheckboxRoot>
      <CheckboxRoot>
        <CheckboxHiddenInput tabIndex={-1} />
        <CheckboxControl />
        <CheckboxLabel>Not Focusable with provided tabIndex</CheckboxLabel>
      </CheckboxRoot>
    </Box>
  )
}
