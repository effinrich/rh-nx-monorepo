// Chakra UI v3: Tag uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { TagRoot as Tag } from '@chakra-ui/react'

// Export Tag compound components (v3 recommended pattern)
export {
  TagCloseTrigger,
  TagEndElement,
  TagLabel,
  TagRoot,
  TagStartElement
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  TagCloseTrigger as TagCloseButton,
  TagStartElement as TagLeftIcon,
  TagEndElement as TagRightIcon
} from '@chakra-ui/react'

// Export types
export type { TagLabelProps, TagRootProps as TagProps } from '@chakra-ui/react'
