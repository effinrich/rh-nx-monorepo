import { useRef, useState } from 'react'
import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import {
  AlertDialogRoot,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogTitle
} from './alert-dialog'

interface BasicUsageProps {
  open?: boolean
}

const BasicUsage = (props: BasicUsageProps) => {
  const [open, setOpen] = useState(props.open || false)

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
        onOpenChange={(e) => setOpen(e.open)}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Please Confirm!</DialogTitle>
            </DialogHeader>
            <DialogBody>
              Are you sure you want to delete something? This action is
              permanent, and we're totally not just flipping a field called
              "deleted" to "true" in our database, we're actually deleting
              something.
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

it('renders no ui when closed', () => {
  render(<BasicUsage />)

  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
})

it("renders an element with role='alertdialog' when opened", () => {
  render(<BasicUsage open />)

  expect(screen.getByRole('alertdialog')).toBeInTheDocument()
})

it('passes a11y test closed', async () => {
  await testA11y(<BasicUsage />)
})

it('passes a11y test opened', async () => {
  await testA11y(<BasicUsage open />)
})
