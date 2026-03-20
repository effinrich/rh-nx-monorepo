// Chakra UI v3: FormControl has been renamed to Field
// See: https://chakra-ui.com/docs/get-started/migration

import { forwardRef } from 'react'
import {
  FieldRoot,
  FieldLabel,
  FieldHelperText,
  FieldErrorText,
  FieldErrorIcon,
  FieldRequiredIndicator,
  type FieldErrorTextProps
} from '@chakra-ui/react'

// In Chakra v3, `Field` is a namespace object (not a component).
// Export FieldRoot as Field for backward compat.
export { FieldRoot as Field }

// Export Field compound components (v3 recommended pattern)
export {
  FieldRoot,
  FieldLabel,
  FieldHelperText,
  FieldErrorText,
  FieldErrorIcon,
  FieldRequiredIndicator
}

// Re-export with v2 names for backward compatibility during migration
export {
  FieldRoot as FormControl,
  FieldLabel as FormLabel,
  FieldHelperText as FormHelperText,
  FieldErrorIcon as FormErrorIcon
}

// FormErrorMessage wrapper — Chakra v3 FieldErrorText has incomplete children typing
export const FormErrorMessage = forwardRef<
  HTMLDivElement,
  FieldErrorTextProps & { children?: React.ReactNode }
>(function FormErrorMessage(props, ref) {
  return <FieldErrorText ref={ref} {...props} />
})
