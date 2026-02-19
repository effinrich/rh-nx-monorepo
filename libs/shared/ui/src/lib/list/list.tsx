// Chakra UI v3: List uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

// In Chakra v3, `List` is a namespace object (not a component).
// Export ListRoot as List for backward compat.
export { ListRoot as List } from '@chakra-ui/react'

// Export List compound components (v3 recommended pattern)
export {
  ListRoot,
  ListItem,
  ListIndicator
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export { ListIndicator as ListIcon } from '@chakra-ui/react'

// UnorderedList and OrderedList - use List with as="ul" or as="ol"
export { ListRoot as UnorderedList, ListRoot as OrderedList } from '@chakra-ui/react'

// Export types
export type { ListRootProps, ListItemProps } from '@chakra-ui/react'
