import { Button } from '../../button/button'
import { useDisclosure } from '../../hooks/use-disclosure/use-disclosure'
import {
  type DialogRootProps,
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

export function BasicUsageHooks(props: DialogRootProps) {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} maxW="300px">
        Open dialog
      </Button>
      <DialogRoot
        {...props}
        open={open}
        onOpenChange={event => {
          if (!event.open) onClose()
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader>
              <DialogTitle>Welcome Home</DialogTitle>
            </DialogHeader>
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
