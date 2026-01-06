// Chakra UI v3: Checkbox uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { Checkbox } from '@chakra-ui/react'

// Export Checkbox compound components (v3 recommended pattern)
export {
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxHiddenInput,
  CheckboxGroup
} from '@chakra-ui/react'

// Export hooks
export { useCheckbox, useCheckboxGroup } from '@chakra-ui/react'

// Export types
export type {
  CheckboxRootProps,
  CheckboxControlProps,
  CheckboxLabelProps,
  CheckboxGroupProps
} from '@chakra-ui/react'
