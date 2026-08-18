import { forwardRef } from 'react'
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent as ChakraDrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerActionTrigger,
  type DrawerContentProps
} from '@chakra-ui/react'

export { Drawer }

export {
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerCloseTrigger,
  DrawerTrigger,
  DrawerActionTrigger
}

export const DrawerOverlay = DrawerBackdrop
export const DrawerCloseButton = DrawerCloseTrigger

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    return (
      <DrawerPositioner>
        <ChakraDrawerContent ref={ref} {...props} />
      </DrawerPositioner>
    )
  }
)
