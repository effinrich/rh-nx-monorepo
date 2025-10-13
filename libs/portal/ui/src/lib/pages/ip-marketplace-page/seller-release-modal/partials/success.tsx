import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@redesignhealth/ui'

interface SuccessProps {
  onConfirmation(): void
}

const Success = ({ onConfirmation }: SuccessProps) => {
  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>Information released successfully</ModalHeader>
      <ModalBody>
        Your contact information was emailed to the interested buyer.
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="primary" onClick={onConfirmation}>
          Got it
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default Success
