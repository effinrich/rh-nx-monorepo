/* eslint-disable react/no-multi-comp */
import { useRef } from 'react'
import { LoremIpsum } from 'react-lorem-ipsum'

import { Meta } from '@storybook/react-vite'

import { Button } from '../button/button'
import { useDisclosure } from '../hooks/use-disclosure/use-disclosure'
import { rh } from '../rh/rh'

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot
} from './modal'

export default {
  component: DialogRoot,
  title: 'Components / Overlay / Dialog'
} as Meta<typeof DialogRoot>

export function BasicUsage() {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <DialogRoot
        open={open}
        onOpenChange={(e) => {
          if (!e.open) onClose()
        }}
        placement="center"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader>Welcome Home</DialogHeader>
            <DialogBody>
              Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
              ullamco deserunt aute id consequat veniam incididunt duis in sint
              irure nisi.
            </DialogBody>
            <DialogFooter>
              <Button colorPalette="red" onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button colorPalette="primary">Save</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
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
        Open Dialog
      </Button>

      <DialogRoot
        finalFocusEl={() => finalRef.current}
        open={open}
        onOpenChange={(e) => {
          if (!e.open) onClose()
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog Title</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
              ullamco deserunt aute id consequat veniam incididunt duis in sint
              irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit
              officia tempor esse quis.
            </DialogBody>

            <DialogFooter>
              <Button colorPalette="red" onClick={onClose} mr={3}>
                Close
              </Button>
              <Button colorPalette="primary">Secondary Action</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  )
}

export function NestedDialog() {
  const first = useDisclosure()
  const second = useDisclosure()
  const third = useDisclosure()
  return (
    <>
      <Button onClick={first.onOpen} maxW="300px">
        Open
      </Button>
      <DialogRoot
        open={first.open}
        onOpenChange={(e) => {
          if (!e.open) first.onClose()
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog Title</DialogHeader>
            <DialogBody>
              Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
              ullamco deserunt aute id consequat veniam incididunt duis in sint
              irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit
              officia tempor esse quis.
            </DialogBody>
            <DialogFooter>
              <rh.div flex="1" />
              <Button mr={3}>Button 2</Button>
              <Button colorPalette="primary" onClick={second.onOpen}>
                Open Nested
              </Button>
            </DialogFooter>

            <DialogRoot
              open={second.open}
              onOpenChange={(e) => {
                if (!e.open) second.onClose()
              }}
            >
              <DialogBackdrop />
              <DialogPositioner>
                <DialogContent>
                  <DialogHeader>Dialog 2 Title</DialogHeader>
                  <DialogFooter>
                    <rh.div flex="1" />
                    <Button colorPalette="primary" onClick={third.onOpen}>
                      Open Nested 2
                    </Button>
                  </DialogFooter>

                  <DialogRoot
                    open={third.open}
                    onOpenChange={(e) => {
                      if (!e.open) third.onClose()
                    }}
                  >
                    <DialogBackdrop />
                    <DialogPositioner>
                      <DialogContent>
                        <DialogHeader tabIndex={0}>Dialog 3 Title</DialogHeader>
                      </DialogContent>
                    </DialogPositioner>
                  </DialogRoot>
                </DialogContent>
              </DialogPositioner>
            </DialogRoot>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
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
      <DialogRoot
        finalFocusEl={() => btnRef.current}
        onOpenChange={(e) => {
          if (!e.open) onClose()
        }}
        open={open}
        scrollBehavior="inside"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog Title</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <LoremIpsum p={5} />
            </DialogBody>
            <DialogFooter>
              <Button colorPalette="red" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
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
      <DialogRoot
        onOpenChange={(e) => {
          if (!e.open) onClose()
        }}
        open={open}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog Title</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <LoremIpsum p={5} />
            </DialogBody>
            <DialogFooter>
              <Button colorPalette="red" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
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
      <DialogRoot
        onOpenChange={(e) => {
          if (!e.open) onClose()
        }}
        open={open}
        size="full"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog Title2</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <LoremIpsum avgWordsPerSentence={30} />
            </DialogBody>
            <DialogFooter>
              <Button colorPalette="red" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  )
}

export function WithCenteredPlacement() {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <DialogRoot
        open={open}
        onOpenChange={(e) => {
          if (!e.open) onClose()
        }}
        placement="center"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader>Welcome Home</DialogHeader>
            <DialogBody>
              Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
              ullamco deserunt aute id consequat veniam incididunt duis in sint
              irure nisi.
            </DialogBody>
            <DialogFooter>
              <Button colorPalette="red" onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button colorPalette="primary">Save</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  )
}
