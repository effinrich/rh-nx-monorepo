import { useRef, useState } from 'react'
import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay
} from './alert-dialog'

interface BasicUsageProps {
  isOpen?: boolean
}

const BasicUsage = (props: BasicUsageProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen || false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button type="button" onClick={onOpen}>
        Delete something
      </button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Please Confirm!</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete something? This action is
              permanent, and we're totally not just flipping a field called
              "deleted" to "true" in our database, we're actually deleting
              something.
            </AlertDialogBody>
            <AlertDialogFooter>
              <button type="button" ref={cancelRef} onClick={onClose}>
                Nevermind
              </button>
              <button type="button">Yes, delete</button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

it('renders no ui when closed', () => {
  render(<BasicUsage />)

  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
})

it("renders an element with role='alertdialog' when opened", () => {
  render(<BasicUsage isOpen />)

  expect(screen.getByRole('alertdialog')).toBeInTheDocument()
})

it('passes a11y test closed', async () => {
  await testA11y(<BasicUsage />)
})

it('passes a11y test opened', async () => {
  await testA11y(<BasicUsage isOpen />)
})
