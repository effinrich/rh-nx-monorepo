// Chakra UI v3: RadioGroup uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { RadioGroup } from '@chakra-ui/react'

// Export RadioGroup compound components (v3 recommended pattern)
export {
  RadioGroupRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemIndicator,
  RadioGroupItemHiddenInput,
  RadioGroupLabel
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export { RadioGroupItem as Radio } from '@chakra-ui/react'

// Export hooks
export { useRadioGroup } from '@chakra-ui/react'

// Export types
export type { RadioGroupRootProps, RadioGroupItemProps } from '@chakra-ui/react'
