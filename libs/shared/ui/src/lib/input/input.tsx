// Chakra UI v3: Input
// Props changed: disabled → disabled, invalid → invalid, readOnly → readOnly
// See: https://chakra-ui.com/docs/get-started/migration

export { Input, InputGroup, InputAddon } from '@chakra-ui/react'

// Export Input compound components (v3 pattern)
export { InputElement } from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  InputAddon as InputLeftAddon,
  InputAddon as InputRightAddon,
  InputElement as InputLeftElement,
  InputElement as InputRightElement
} from '@chakra-ui/react'

// Export types
export type { InputProps, InputGroupProps } from '@chakra-ui/react'
