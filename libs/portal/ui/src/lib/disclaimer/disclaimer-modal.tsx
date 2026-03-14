import { forwardRef, ReactNode, useImperativeHandle } from 'react'
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  useDisclosure
} from '@redesignhealth/ui'

export interface DisclaimerModalProps {
  children: ReactNode
  header: string
  buttonText: string
}

export const DisclaimerModal = forwardRef(
  ({ children, header, buttonText }: DisclaimerModalProps, ref) => {
    const { open, onOpen, onClose } = useDisclosure()

    useImperativeHandle(ref, () => ({
      handleOnOpen() {
        onOpen()
      }
    }))

    return (
      <DialogRoot
        open={open}
        onOpenChange={(e: { open: boolean }) => !e.open && onClose()}
        placement="center"
        size={{ base: 'full', md: 'md' }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          {/* @ts-expect-error Chakra v3 DialogContent children typing */}
          <DialogContent>
            <DialogHeader>{header}</DialogHeader>
            <DialogBody color="gray.500">{children}</DialogBody>
            <DialogFooter>
              <Button onClick={onClose} colorPalette="primary">
                {buttonText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    )
  }
)

DisclaimerModal.displayName = 'DisclaimerModal'
