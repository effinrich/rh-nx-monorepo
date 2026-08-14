// Chakra UI v3: Alert uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { AlertRoot as Alert } from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Alert.* components instead
export {
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from '@chakra-ui/react'

// v2 compatibility aliases (deprecated)
export {
  AlertRoot as AlertContainer,
  AlertIndicator as AlertIcon
} from '@chakra-ui/react'
