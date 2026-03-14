// Chakra UI v3: Drawer uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

// Export Drawer compound namespace (v3 recommended: Drawer.Root, Drawer.Content, etc.)
export { Drawer } from '@chakra-ui/react'

// Export v3 named Drawer components
export {
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerCloseTrigger,
  DrawerTrigger,
  DrawerActionTrigger
} from '@chakra-ui/react'

// v2 backward-compat aliases
export {
  DrawerBackdrop as DrawerOverlay,
  DrawerCloseTrigger as DrawerCloseButton
} from '@chakra-ui/react'
