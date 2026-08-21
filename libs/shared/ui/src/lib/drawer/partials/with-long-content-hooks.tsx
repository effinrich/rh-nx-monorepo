import { useState } from 'react'

import { Button, Input, Text } from '../../index'
import { type DrawerRootProps,Drawer } from '../drawer'

export function WithLongContentHooks(args: DrawerRootProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} maxW="150px">
        Open
      </Button>
      <Drawer.Root
        placement="bottom"
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        open={open}
        size="md"
        {...args}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">Basic Drawer</Drawer.Header>
            <Drawer.Body>
              <Input placeholder="Type here..." my={4} />
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                suscipit, ligula sit amet pharetra accumsan, nulla augue fermentum
                dui, eget finibus diam sapien eget nisi.
              </Text>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}
