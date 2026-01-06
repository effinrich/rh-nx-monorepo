// Chakra UI v3: Avatar uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { Avatar } from '@chakra-ui/react'

// Export Avatar compound components (v3 recommended pattern)
export {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarIcon,
  AvatarGroup
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export { AvatarRoot as AvatarBadge } from '@chakra-ui/react'

// Export types
export type { AvatarRootProps, AvatarGroupProps } from '@chakra-ui/react'
