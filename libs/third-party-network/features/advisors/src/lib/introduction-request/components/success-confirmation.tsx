import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn
} from '@redesignhealth/ui'

interface SuccessConfirmationProps {
  advisorName?: string
  onClose: VoidFunction
  isOpen: UseDisclosureReturn['isOpen']
}

export const SuccessConfirmation = ({
  isOpen,
  onClose,
  advisorName
}: SuccessConfirmationProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Successful Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Your request for {advisorName ?? 'the advisor'} has been submitted.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
