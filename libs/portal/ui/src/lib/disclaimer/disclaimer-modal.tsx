import { forwardRef, ReactNode, useImperativeHandle } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@redesignhealth/ui'

export interface DisclaimerModalProps {
  children: ReactNode
  header: string
  buttonText: string
}

export const DisclaimerModal = forwardRef(
  ({ children, header, buttonText }: DisclaimerModalProps, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    useImperativeHandle(ref, () => ({
      handleOnOpen() {
        onOpen()
      }
    }))

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={['full', 'md']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalBody color="gray.500">{children}</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="primary">
              {buttonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)

DisclaimerModal.displayName = 'DisclaimerModal'
