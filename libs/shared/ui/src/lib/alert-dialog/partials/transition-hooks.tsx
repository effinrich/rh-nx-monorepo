import { useRef } from 'react'

import { Button } from '../../button/button'
import { useDisclosure } from '../../hooks/use-disclosure/use-disclosure'
import {
  AlertDialogRoot,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogTitle
} from '../alert-dialog'

export function TransitionHooks(args: Record<string, unknown>) {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button onClick={onOpen} maxW="150px">
        Discard
      </Button>

      <AlertDialogRoot
        onOpenChange={(e: { open: boolean }) => {
          if (!e.open) onClose()
        }}
        open={open}
        placement="center"
        initialFocusEl={() => cancelRef.current}
        {...args}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              Are you sure you want to discard all of your notes? 44 words will
              be deleted.
            </DialogBody>
            <DialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorPalette="red" ml={3}>
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </AlertDialogRoot>
    </>
  )
}
