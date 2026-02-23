// Chakra UI v3: AlertDialog is now part of Dialog with role="alertdialog"
// See: https://chakra-ui.com/docs/get-started/migration

// Dialog is a namespace object in Chakra v3 - don't export it directly as a component.
// Export Dialog compound components as AlertDialog for v2 compatibility
export {
  DialogRoot as AlertDialog,
  DialogBackdrop as AlertDialogOverlay,
  DialogContent as AlertDialogContent,
  DialogHeader as AlertDialogHeader,
  DialogBody as AlertDialogBody,
  DialogFooter as AlertDialogFooter,
  DialogCloseTrigger as AlertDialogCloseButton
} from '@chakra-ui/react'

// Export types
export type {
  DialogRootProps as AlertDialogProps,
  DialogContentProps as AlertDialogContentProps
} from '@chakra-ui/react'
