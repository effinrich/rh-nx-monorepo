// Chakra UI v3: Divider has been renamed to Separator
// See: https://chakra-ui.com/docs/get-started/migration

export { Separator } from '@chakra-ui/react'

// Re-export with v2 name for backward compatibility
export { Separator as Divider } from '@chakra-ui/react'

// Export types
export type { SeparatorProps } from '@chakra-ui/react'

// Also re-export as SeparatorProps for v2 compatibility
export type { SeparatorProps as DividerProps } from '@chakra-ui/react'
