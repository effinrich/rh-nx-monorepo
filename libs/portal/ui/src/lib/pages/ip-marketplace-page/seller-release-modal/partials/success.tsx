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
    // @ts-expect-error Chakra v3 DialogContent children typing
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>Information released successfully</ModalHeader>
      <ModalBody>
        Your contact information was emailed to the interested buyer.
      </ModalBody>
      <ModalFooter>
        <Button colorPalette="primary" onClick={onConfirmation}>
          Got it
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default Success
