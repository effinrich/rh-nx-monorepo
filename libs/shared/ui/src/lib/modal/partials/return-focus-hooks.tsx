import { useRef } from 'react'

import { Button } from '../../button/button'
import { useDisclosure } from '../../hooks/use-disclosure/use-disclosure'
import { rh } from '../../rh/rh'
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot
} from '../modal'

export function ReturnFocusHooks() {
  const { open, onOpen, onClose } = useDisclosure()
  const finalRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <rh.div ref={finalRef} tabIndex={-1} aria-label="Focus moved to this box">
        Some other content that&apos;ll receive focus on close.
      </rh.div>

      <Button mt={4} onClick={onOpen} maxW="300px">
        Open Dialog
      </Button>

      <DialogRoot
        finalFocusEl={() => finalRef.current}
        open={open}
        onOpenChange={e => {
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
