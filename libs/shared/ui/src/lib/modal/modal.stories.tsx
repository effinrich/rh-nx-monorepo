/* eslint-disable react/no-multi-comp */
import { useRef } from 'react'
import { LoremIpsum } from 'react-lorem-ipsum'
import { FocusableElement } from '@chakra-ui/utils'

import { Meta } from '@storybook/react-vite'

import { Button } from '../button/button'
import { useDisclosure } from '../hooks/use-disclosure/use-disclosure'
import { rh } from '../rh/rh'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from './modal'

export default {
  component: Modal,
  title: 'Components / Overlay / Modal'
} as Meta<typeof Modal>

export function BasicUsage() {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <Modal
        open={open}
        onOpenChange={e => (e.open ? onOpen() : onClose())}
        placement="center"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Welcome Home</ModalHeader>
          <ModalBody>
            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
            ullamco deserunt aute id consequat veniam incididunt duis in sint
            irure nisi.
          </ModalBody>
          <ModalFooter>
            <Button colorPalette="red" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorPalette="primary">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export function ReturnFocus() {
  const { open, onOpen, onClose } = useDisclosure()
  const finalRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <rh.div ref={finalRef} tabIndex={-1} aria-label="Focus moved to this box">
        Some other content that'll receive focus on close.
      </rh.div>

      <Button mt={4} onClick={onOpen} maxW="300px">
        Open Modal
      </Button>

      <Modal
        finalFocusEl={() => finalRef.current}
        open={open}
        onOpenChange={e => (e.open ? onOpen() : onClose())}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
            ullamco deserunt aute id consequat veniam incididunt duis in sint
            irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit
            officia tempor esse quis.
          </ModalBody>

          <ModalFooter>
            <Button colorPalette="red" onClick={onClose} mr={3}>
              Close
            </Button>
            <Button colorPalette="primary">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export function NestedModal() {
  const first = useDisclosure()
  const second = useDisclosure()
  const third = useDisclosure()
  return (
    <>
      <Button onClick={first.onOpen} maxW="300px">
        Open
      </Button>
      <Modal
        open={first.open}
        onOpenChange={e => (e.open ? first.onOpen() : first.onClose())}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>
            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
            ullamco deserunt aute id consequat veniam incididunt duis in sint
            irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit
            officia tempor esse quis.
          </ModalBody>
          <ModalFooter>
            <rh.div flex="1" />
            <Button mr={3}>Button 2</Button>
            <Button colorPalette="primary" onClick={second.onOpen}>
              Open Nested
            </Button>
          </ModalFooter>

          <Modal
            open={second.open}
            onOpenChange={e => (e.open ? second.onOpen() : second.onClose())}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal 2 Title</ModalHeader>
              <ModalFooter>
                <rh.div flex="1" />
                <Button colorPalette="primary" onClick={third.onOpen}>
                  Open Nested 2
                </Button>
              </ModalFooter>

              <Modal
                open={third.open}
                onOpenChange={e => (e.open ? third.onOpen() : third.onClose())}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader tabIndex={0}>Modal 3 Title</ModalHeader>
                </ModalContent>
              </Modal>
            </ModalContent>
          </Modal>
        </ModalContent>
      </Modal>
    </>
  )
}

export const InsideScroll = () => {
  const { open, onClose, onOpen } = useDisclosure()
  const btnRef = useRef(null)
  return (
    <>
      <Button onClick={onOpen} ref={btnRef} maxW="300px">
        Open
      </Button>
      <Modal
        finalFocusEl={() => btnRef.current}
        onOpenChange={e => (e.open ? onOpen() : onClose())}
        open={open}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoremIpsum p={5} />
          </ModalBody>
          <ModalFooter>
            <Button colorPalette="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const AnimationDisabled = () => {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <Modal onOpenChange={e => (e.open ? onOpen() : onClose())} open={open}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoremIpsum p={5} />
          </ModalBody>
          <ModalFooter>
            <Button colorPalette="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const FullWithLongContent = () => {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <Modal
        onOpenChange={e => (e.open ? onOpen() : onClose())}
        open={open}
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title2</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoremIpsum avgWordsPerSentence={30} />
          </ModalBody>
          <ModalFooter>
            <Button colorPalette="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export function WithCustomMotionProps() {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <Modal
        open={open}
        onOpenChange={e => (e.open ? onOpen() : onClose())}
        placement="center"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Welcome Home</ModalHeader>
          <ModalBody>
            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
            ullamco deserunt aute id consequat veniam incididunt duis in sint
            irure nisi.
          </ModalBody>
          <ModalFooter>
            <Button colorPalette="red" onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorPalette="primary">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
