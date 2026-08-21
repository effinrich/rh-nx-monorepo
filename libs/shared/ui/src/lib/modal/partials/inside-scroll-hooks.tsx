import { useRef } from 'react'
import { LoremIpsum } from 'react-lorem-ipsum'

import { Button } from '../../button/button'
import { useDisclosure } from '../../hooks/use-disclosure/use-disclosure'
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

export function InsideScrollHooks() {
  const { open, onClose, onOpen } = useDisclosure()
  const btnRef = useRef(null)
  return (
    <>
      <Button onClick={onOpen} ref={btnRef} maxW="300px">
        Open
      </Button>
      <DialogRoot
        finalFocusEl={() => btnRef.current}
        onOpenChange={e => {
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
