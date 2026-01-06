// Chakra UI v3: Tag uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { Tag } from '@chakra-ui/react'

// Export Tag compound components (v3 recommended pattern)
export {
  TagRoot,
  TagLabel,
  TagCloseTrigger,
  TagStartElement,
  TagEndElement
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  TagCloseTrigger as TagCloseButton,
  TagStartElement as TagLeftIcon,
  TagEndElement as TagRightIcon
} from '@chakra-ui/react'

// Export types
export type { TagRootProps, TagLabelProps } from '@chakra-ui/react'
