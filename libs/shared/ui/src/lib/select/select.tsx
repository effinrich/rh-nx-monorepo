// Chakra UI v3: Select has been renamed to NativeSelect for native select
// For custom selects, use the Select component with compound pattern
// See: https://chakra-ui.com/docs/get-started/migration

export {
  NativeSelectRoot as NativeSelect,
  SelectRoot as Select
} from '@chakra-ui/react'

// Export NativeSelect compound components
export {
  NativeSelectRoot,
  NativeSelectField,
  NativeSelectIndicator
} from '@chakra-ui/react'

// Export Select compound components (for custom select)
export {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectLabel,
  SelectPositioner,
  SelectValueText,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectClearTrigger,
  SelectControl,
  SelectHiddenSelect
} from '@chakra-ui/react'

// Export types
export type { NativeSelectRootProps, SelectRootProps } from '@chakra-ui/react'
