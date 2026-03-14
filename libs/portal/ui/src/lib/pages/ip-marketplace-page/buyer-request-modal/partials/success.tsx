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
      <ModalHeader>Request sent successfully</ModalHeader>
      <ModalBody>
        We'll email you when the seller releases their contact information to
        you.
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
