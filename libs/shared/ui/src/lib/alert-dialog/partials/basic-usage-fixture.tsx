import { useRef, useState } from 'react'

import {
  AlertDialogRoot,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogTitle
} from '../alert-dialog'

interface BasicUsageFixtureProps {
  open?: boolean
}

export function BasicUsageFixture({
  open: initialOpen = false
}: BasicUsageFixtureProps) {
  const [open, setOpen] = useState(initialOpen)

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button type="button" onClick={onOpen}>
        Delete something
      </button>
      <AlertDialogRoot
        open={open}
        initialFocusEl={() => cancelRef.current}
        onOpenChange={e => setOpen(e.open)}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Please Confirm!</DialogTitle>
            </DialogHeader>
            <DialogBody>
              Are you sure you want to delete something? This action is
              permanent, and we&apos;re totally not just flipping a field called
              &quot;deleted&quot; to &quot;true&quot; in our database,
              we&apos;re actually deleting something.
            </DialogBody>
            <DialogFooter>
              <button type="button" ref={cancelRef} onClick={onClose}>
                Nevermind
              </button>
              <button type="button">Yes, delete</button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </AlertDialogRoot>
    </>
  )
}
