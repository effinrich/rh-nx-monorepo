import { forwardRef } from 'react'
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  type DialogContentProps,
  type DialogRootProps
} from '@chakra-ui/react'

export const AlertDialog = DialogRoot
export const AlertDialogOverlay = DialogBackdrop
export const AlertDialogHeader = DialogHeader
export const AlertDialogBody = DialogBody
export const AlertDialogFooter = DialogFooter
export const AlertDialogCloseButton = DialogCloseTrigger

export const AlertDialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function AlertDialogContent(props, ref) {
    return (
      <DialogPositioner>
        <DialogContent ref={ref} role="alertdialog" {...props} />
      </DialogPositioner>
    )
  }
)

export type AlertDialogProps = DialogRootProps
export type AlertDialogContentProps = DialogContentProps
