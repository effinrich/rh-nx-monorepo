import {
  DialogRoot,
  type DialogRootProps
} from '@chakra-ui/react'

export {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogTitle
} from '@chakra-ui/react'

export function AlertDialogRoot(props: DialogRootProps) {
  return <DialogRoot role="alertdialog" {...props} />
}

export type { DialogRootProps, DialogContentProps } from '@chakra-ui/react'
