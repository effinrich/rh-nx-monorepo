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

export function BasicUsageHooks() {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open
      </Button>
      <DialogRoot
        open={open}
        onOpenChange={e => {
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
