import { useState } from 'react'
import { CloseButton } from '@chakra-ui/react'

import { Button, Portal, Wrap, WrapItem } from '../../index'
import { type DrawerRootProps,Drawer } from '../drawer'

const DRAWER_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const

type DrawerSize = (typeof DRAWER_SIZES)[number]

export function WithSizeHooks(args: DrawerRootProps) {
  const [size, setSize] = useState<DrawerSize>('xs')
  const [open, setOpen] = useState(false)

  const handleClick = (newSize: DrawerSize) => {
    setSize(newSize)
    setOpen(true)
  }

  return (
    <>
      <Wrap>
        {DRAWER_SIZES.map(s => (
          <WrapItem key={s}>
            <Button
              onClick={() => handleClick(s)}
              m={4}
            >{`Open ${s} Drawer`}</Button>
          </WrapItem>
        ))}
      </Wrap>
      <Drawer.Root
        open={open}
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        size={size}
        {...args}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
              <Drawer.Header>{`${size} drawer contents`}</Drawer.Header>
              <Drawer.Body>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}
