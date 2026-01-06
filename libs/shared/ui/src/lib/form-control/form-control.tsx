// Chakra UI v3: FormControl has been renamed to Field
// See: https://chakra-ui.com/docs/get-started/migration

export { Field } from '@chakra-ui/react'

// Export Field compound components (v3 recommended pattern)
export {
  FieldRoot,
  FieldLabel,
  FieldHelperText,
  FieldErrorText,
  FieldErrorIcon,
  FieldRequiredIndicator
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Field.* components instead
export {
  FieldRoot as FormControl,
  FieldLabel as FormLabel,
  FieldHelperText as FormHelperText,
  FieldErrorText as FormErrorMessage,
  FieldErrorIcon as FormErrorIcon
} from '@chakra-ui/react'
