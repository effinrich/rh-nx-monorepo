// Chakra UI v3: Stat uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { Stat } from '@chakra-ui/react'

// Export Stat compound components (v3 recommended pattern)
export {
  StatRoot,
  StatLabel,
  StatValueText,
  StatHelpText,
  StatUpIndicator,
  StatDownIndicator,
  StatValueUnit
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  StatValueText as StatNumber,
  StatUpIndicator as StatArrow
} from '@chakra-ui/react'

// StatGroup is removed in v3 - use HStack/SimpleGrid instead

// Export types
export type { StatRootProps, StatLabelProps } from '@chakra-ui/react'
