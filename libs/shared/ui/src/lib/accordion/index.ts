// Chakra UI v3: Accordion - all components from @chakra-ui/react
// Custom implementations are deprecated - use Chakra UI v3 compound components
// See: https://chakra-ui.com/docs/get-started/migration

export {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemBody,
  // v2 compatibility aliases
  AccordionItemTrigger as AccordionButton,
  AccordionItemContent as AccordionPanel,
  AccordionItemIndicator as AccordionIcon
} from './accordion'

// Export types
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
  AccordionItemContentProps
} from './accordion'

// v2 compatibility type aliases
export type { AccordionRootProps as AccordionProps } from './accordion'
export type { AccordionItemTriggerProps as AccordionButtonProps } from './accordion'
export type { AccordionItemContentProps as AccordionPanelProps } from './accordion'
export type { AccordionItemIndicator as AccordionIconProps } from './accordion'
