// Chakra UI v3: Alert uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { AlertRoot as Alert } from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Alert.* components instead
export {
  AlertRoot,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle
} from '@chakra-ui/react'

// v2 compatibility aliases (deprecated)
export {
  AlertIndicator as AlertIcon,
  AlertRoot as AlertContainer
} from '@chakra-ui/react'
