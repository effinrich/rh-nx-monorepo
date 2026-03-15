import { useRef } from 'react'
import { useDisclosure } from '@chakra-ui/react'

import { Meta } from '@storybook/react-vite'

import { Button } from '../button/button'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay
} from './alert-dialog'

export default {
  component: AlertDialog,
  title: 'Components / Overlay / Alert Dialog',
  argTypes: {
    size: {
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        'full'
      ],
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
} as Meta<typeof AlertDialog>

const BasicUsageHooks = (args: any) => {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button colorPalette="red" onClick={onOpen} maxW="150px">
        Delete Customer
      </Button>
      <AlertDialog
        role="alertdialog"
        open={open}
        onOpenChange={(e: { open: boolean }) => {
          if (!e.open) onClose()
        }}
        {...args}
      >
        <AlertDialogOverlay />
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Customer
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorPalette="red" onClick={onClose} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const BasicUsage = {
  render: (args: any) => <BasicUsageHooks {...args} />
}

const TransitionHooks = (args: any) => {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button onClick={onOpen} maxW="150px">
        Discard
      </Button>

      <AlertDialog
        role="alertdialog"
        onOpenChange={(e: { open: boolean }) => {
          if (!e.open) onClose()
        }}
        open={open}
        placement="center"
        {...args}
      >
        <AlertDialogOverlay />

        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to discard all of your notes? 44 words will be
            deleted.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorPalette="red" ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const Transition = {
  render: (args: any) => <TransitionHooks {...args} />
}
