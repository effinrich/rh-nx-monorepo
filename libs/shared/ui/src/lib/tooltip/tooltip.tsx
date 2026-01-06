// Chakra UI v3: Tooltip uses compound component pattern
// Props changed: placement/gutter/offset moved to positioning prop
// See: https://chakra-ui.com/docs/get-started/migration

export { Tooltip } from '@chakra-ui/react'

// Export Tooltip compound components (v3 recommended pattern)
export {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipArrowTip,
  TooltipPositioner
} from '@chakra-ui/react'

// Export types
export type { TooltipRootProps, TooltipContentProps } from '@chakra-ui/react'
