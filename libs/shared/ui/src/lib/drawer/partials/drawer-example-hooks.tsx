import { useRef } from 'react'
import { CloseButton } from '@chakra-ui/react'

import {
  Button,
  Input,
  Portal
} from '../../index'
import { type DrawerRootProps,Drawer } from '../drawer'

export function DrawerExampleHooks(args: DrawerRootProps) {
  const { open, onClose } = { open: false, onClose: () => undefined }
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <Drawer.Root
      open={open}
      placement="end"
      onOpenChange={(e: { open: boolean }) => !e.open && onClose()}
      {...args}
    >
      <Drawer.Trigger asChild>
        <Button ref={btnRef} variant="outline" size="sm">
          Open
        </Button>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Create your account</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Input placeholder="Type here..." />
            </Drawer.Body>

            <Drawer.Footer>
              <Button
                variant="outline"
                mr={3}
                onClick={onClose}
                colorPalette="red"
              >
                Cancel
              </Button>
              <Button colorPalette="blue">Save</Button>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
