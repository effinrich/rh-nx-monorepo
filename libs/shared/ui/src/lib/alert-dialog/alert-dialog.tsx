import { type DialogRootProps, DialogRoot } from '@chakra-ui/react'

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

export type { DialogContentProps, DialogRootProps } from '@chakra-ui/react'
