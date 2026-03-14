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
  isOpen: boolean
}

export const SuccessConfirmation = ({
  isOpen,
  onClose,
  advisorName
}: SuccessConfirmationProps) => {
  return (
    <Modal open={isOpen} onOpenChange={(e: { open: boolean }) => !e.open && onClose()} size="xl">
      <ModalOverlay />
      {/* @ts-expect-error Chakra v3 DialogContent children typing */}
      <ModalContent>
        <ModalHeader>Successful Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Your request for {advisorName ?? 'the advisor'} has been submitted.
        </ModalBody>
        <ModalFooter>
          <Button colorPalette="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
