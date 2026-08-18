import { useRef } from 'react'
import { useDisclosure } from '@chakra-ui/react'

import { Meta } from '@storybook/react-vite'

import { Button } from '../button/button'

import {
  AlertDialogRoot,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner
} from './alert-dialog'

export default {
  component: AlertDialogRoot,
  title: 'Components / Overlay / Alert Dialog',
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      control: { type: 'radio' }
    },
    placement: {
      options: ['center', 'top', 'bottom'],
      control: { type: 'radio' }
    },
    closeOnInteractOutside: {
      options: [true, false],
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof AlertDialogRoot>

const BasicUsageHooks = (args: Record<string, unknown>) => {
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

export const BasicUsage = {
  render: (args: Record<string, unknown>) => <BasicUsageHooks {...args} />
}

const TransitionHooks = (args: Record<string, unknown>) => {
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
            <DialogHeader>Discard Changes?</DialogHeader>
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

export const Transition = {
  render: (args: Record<string, unknown>) => <TransitionHooks {...args} />
}
