// Chakra UI v3: Stat uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { StatRoot as Stat } from '@chakra-ui/react'

// Export Stat compound components (v3 recommended pattern)
export {
  StatDownIndicator,
  StatHelpText,
  StatLabel,
  StatRoot,
  StatUpIndicator,
  StatValueText,
  StatValueUnit
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  StatUpIndicator as StatArrow,
  StatValueText as StatNumber
} from '@chakra-ui/react'

// StatGroup is removed in v3 - use HStack/SimpleGrid instead

// Export types
export type { StatLabelProps, StatRootProps } from '@chakra-ui/react'
