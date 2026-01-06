// Chakra UI v3: Switch uses compound component pattern
// Props changed: isChecked → checked, isDisabled → disabled
// See: https://chakra-ui.com/docs/get-started/migration

export { Switch } from '@chakra-ui/react'

// Export Switch compound components (v3 recommended pattern)
export {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchIndicator
} from '@chakra-ui/react'

// Export types
export type { SwitchRootProps } from '@chakra-ui/react'
