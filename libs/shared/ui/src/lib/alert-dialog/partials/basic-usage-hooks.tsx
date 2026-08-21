import { useRef } from 'react'
import { useDisclosure } from '@chakra-ui/react'

import { Button } from '../../button/button'
import {
  AlertDialogRoot,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner
} from '../alert-dialog'

export function BasicUsageHooks(args: Record<string, unknown>) {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button colorPalette="red" onClick={onOpen} maxW="150px">
        Delete Customer
      </Button>
      <AlertDialogRoot
        open={open}
        initialFocusEl={() => cancelRef.current}
        onOpenChange={(e: { open: boolean }) => {
          if (!e.open) onClose()
        }}
        {...args}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </DialogHeader>

            <DialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </DialogBody>

            <DialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </AlertDialogRoot>
    </>
  )
}
