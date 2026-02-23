import { useRef } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'

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
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        'full'
      ],
      control: { type: 'radio' }
    },
    motionPreset: {
      options: ['scale', 'slideInBottom', 'slideInRight'],
      control: { type: 'radio' }
    },
    returnFocusOnClose: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    preserveScrollBarGap: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    closeOnOverlayClick: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    autoFocus: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    allowPinchZoom: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    isCentered: {
      options: [true, false],
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof AlertDialog>

const BasicUsageHooks = (args: any) => {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<{ handleOnClose(): void }>()
  return (
    <>
      <Button colorPalette="red" onClick={onOpen} maxW="150px">
        Delete Customer
      </Button>
      <AlertDialog
        open={open}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        {...args}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
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
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export const BasicUsage = {
  render: (args: any) => <BasicUsageHooks {...args} />
}

const TransitionHooks = (args: any) => {
  const { open, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<{ handleOnClose(): void }>()

  return (
    <>
      <Button onClick={onOpen} maxW="150px">
        Discard
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        open={open}
        isCentered
        {...args}
      >
        <AlertDialogOverlay />

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
