// Chakra UI v3: Modal has been renamed to Dialog
// See: https://chakra-ui.com/docs/get-started/migration

export { Dialog } from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Dialog.* components instead
export {
  Dialog as Modal,
  DialogBody as ModalBody,
  DialogCloseTrigger as ModalCloseButton,
  DialogContent as ModalContent,
  DialogFooter as ModalFooter,
  DialogHeader as ModalHeader,
  DialogBackdrop as ModalOverlay,
  DialogTitle as ModalTitle,
  DialogDescription as ModalDescription
} from '@chakra-ui/react'

// Export Dialog compound components (v3 recommended pattern)
export {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTrigger,
  DialogActionTrigger
} from '@chakra-ui/react'
