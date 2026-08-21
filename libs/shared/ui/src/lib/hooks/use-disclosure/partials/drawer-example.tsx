import {
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot
} from '../../../index'
import { useDisclosure } from '../use-disclosure'

export function DrawerExample() {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Drawer</Button>
      <DrawerRoot
        placement="right"
        onOpenChange={({ open: isOpen }) => {
          if (!isOpen) onClose()
        }}
        open={open}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
            <DrawerBody>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  )
}
