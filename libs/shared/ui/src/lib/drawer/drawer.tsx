// Chakra UI v3: Drawer uses compound component pattern (same as Dialog)
// See: https://chakra-ui.com/docs/get-started/migration

export { Drawer } from '@chakra-ui/react'

// Export Drawer compound components (v3 recommended pattern)
export {
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerCloseTrigger,
  DrawerTrigger,
  DrawerActionTrigger
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Drawer.* components instead
export {
  DrawerBackdrop as DrawerOverlay,
  DrawerCloseTrigger as DrawerCloseButton
} from '@chakra-ui/react'
