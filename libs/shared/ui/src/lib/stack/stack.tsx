// Chakra UI v3: Stack
// Props changed: spacing → gap, divider → use Stack.Separator between items
// See: https://chakra-ui.com/docs/get-started/migration

export { Stack, HStack, VStack } from '@chakra-ui/react'

// Export Stack compound components
export { StackSeparator } from '@chakra-ui/react'

// Re-export with v2 name for backward compatibility
export { StackSeparator as StackDivider } from '@chakra-ui/react'

// Export types
export type { StackProps, StackSeparatorProps } from '@chakra-ui/react'
