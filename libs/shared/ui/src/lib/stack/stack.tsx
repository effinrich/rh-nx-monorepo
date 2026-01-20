// Chakra UI v3: Stack
// Props changed: spacing → gap, divider → use Stack.Separator between items
// See: https://chakra-ui.com/docs/get-started/migration

// Note: HStack and VStack are exported from their own files (h-stack, v-stack)
export { Stack } from '@chakra-ui/react'

// Export Stack compound components
export { StackSeparator } from '@chakra-ui/react'

// Re-export with v2 name for backward compatibility
export { StackSeparator as StackDivider } from '@chakra-ui/react'

// Export types
export type { StackProps, StackSeparatorProps } from '@chakra-ui/react'
