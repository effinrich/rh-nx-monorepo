import { forwardRef } from 'react'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBackdrop,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogActionTrigger,
  type DialogContentProps
} from '@chakra-ui/react'

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
}

export const Modal = DialogRoot
export const ModalBody = DialogBody
export const ModalCloseButton = DialogCloseTrigger
export const ModalFooter = DialogFooter
export const ModalHeader = DialogHeader
export const ModalOverlay = DialogBackdrop
export const ModalTitle = DialogTitle
export const ModalDescription = DialogDescription

/**
 * v2 ModalContent included overlay positioning. Wrap Dialog.Content
 * with Dialog.Positioner so existing Modal consumers still center.
 */
export const ModalContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function ModalContent(props, ref) {
    return (
      <DialogPositioner>
        <DialogContent ref={ref} {...props} />
      </DialogPositioner>
    )
  }
)
