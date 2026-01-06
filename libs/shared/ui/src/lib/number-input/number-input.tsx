// Chakra UI v3: NumberInput uses compound component pattern
// onChange → onValueChange, onInvalid → onValueInvalid
// See: https://chakra-ui.com/docs/get-started/migration

export { NumberInput } from '@chakra-ui/react'

// Export NumberInput compound components (v3 recommended pattern)
export {
  NumberInputRoot,
  NumberInputInput,
  NumberInputControl,
  NumberInputIncrementTrigger,
  NumberInputDecrementTrigger,
  NumberInputLabel,
  NumberInputScrubber,
  NumberInputValueText
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  NumberInputInput as NumberInputField,
  NumberInputControl as NumberInputStepper,
  NumberInputIncrementTrigger as NumberIncrementStepper,
  NumberInputDecrementTrigger as NumberDecrementStepper
} from '@chakra-ui/react'

// Export hooks
export { useNumberInput } from '@chakra-ui/react'

// Export types
export type { NumberInputRootProps } from '@chakra-ui/react'
