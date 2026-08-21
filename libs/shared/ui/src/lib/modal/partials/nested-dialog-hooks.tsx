import { Button } from '../../button/button'
import { useDisclosure } from '../../hooks/use-disclosure/use-disclosure'
import { rh } from '../../rh/rh'
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot
} from '../modal'

export function NestedDialogHooks() {
  const first = useDisclosure()
  const second = useDisclosure()
  const third = useDisclosure()
  return (
    <>
      <Button onClick={first.onOpen} maxW="300px">
        Open
      </Button>
      <DialogRoot
        open={first.open}
        onOpenChange={e => {
          if (!e.open) first.onClose()
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog Title</DialogHeader>
            <DialogBody>
              Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
              ullamco deserunt aute id consequat veniam incididunt duis in sint
              irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit
              officia tempor esse quis.
            </DialogBody>
            <DialogFooter>
              <rh.div flex="1" />
              <Button mr={3}>Button 2</Button>
              <Button colorPalette="primary" onClick={second.onOpen}>
                Open Nested
              </Button>
            </DialogFooter>

            <DialogRoot
              open={second.open}
              onOpenChange={e => {
                if (!e.open) second.onClose()
              }}
            >
              <DialogBackdrop />
              <DialogPositioner>
                <DialogContent>
                  <DialogHeader>Dialog 2 Title</DialogHeader>
                  <DialogFooter>
                    <rh.div flex="1" />
                    <Button colorPalette="primary" onClick={third.onOpen}>
                      Open Nested 2
                    </Button>
                  </DialogFooter>

                  <DialogRoot
                    open={third.open}
                    onOpenChange={e => {
                      if (!e.open) third.onClose()
                    }}
                  >
                    <DialogBackdrop />
                    <DialogPositioner>
                      <DialogContent>
                        <DialogHeader tabIndex={0}>Dialog 3 Title</DialogHeader>
                      </DialogContent>
                    </DialogPositioner>
                  </DialogRoot>
                </DialogContent>
              </DialogPositioner>
            </DialogRoot>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  )
}
