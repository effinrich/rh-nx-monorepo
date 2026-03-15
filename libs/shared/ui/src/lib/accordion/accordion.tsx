// Chakra UI v3: Accordion uses compound component pattern
// allowMultiple → multiple, allowToggle → collapsible
// index → value, defaultIndex → defaultValue
// onChange → onValueChange
// See: https://chakra-ui.com/docs/get-started/migration

// In Chakra v3, `Accordion` is a namespace object (not a component).
// Export AccordionRoot as Accordion for backward compat with v2 usage of <Accordion>.
export { AccordionRoot as Accordion } from '@chakra-ui/react'

// Export Accordion compound components (v3 recommended pattern)
export {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemBody
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  AccordionItemTrigger as AccordionButton,
  AccordionItemContent as AccordionPanel,
  AccordionItemIndicator as AccordionIcon
} from '@chakra-ui/react'

// Export types
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionItemTriggerProps,
  AccordionItemContentProps
} from '@chakra-ui/react'
