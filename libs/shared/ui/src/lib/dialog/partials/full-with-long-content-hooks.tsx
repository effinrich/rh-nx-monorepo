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
  DialogRoot,
  DialogTitle
} from '../dialog'

export function FullWithLongContentHooks() {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <DialogRoot
        onOpenChange={e => {
          if (!e.open) onClose()
        }}
        open={open}
        size="full"
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
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
