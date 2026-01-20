// Chakra UI v3: Drawer uses compound component pattern (same as Dialog)
// See: https://chakra-ui.com/docs/get-started/migration

export { DrawerRoot as Drawer } from '@chakra-ui/react'

// Export Drawer compound components (v3 recommended pattern)
export {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Drawer.* components instead
export type { DrawerRootProps } from '@chakra-ui/react'
export {
  DrawerCloseTrigger as DrawerCloseButton,
  DrawerBackdrop as DrawerOverlay
} from '@chakra-ui/react'
