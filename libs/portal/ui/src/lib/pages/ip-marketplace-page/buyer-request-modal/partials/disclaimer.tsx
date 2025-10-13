import { BuyerDisclaimerHtml } from '@redesignhealth/portal/data-assets'
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@redesignhealth/ui'

interface DisclaimerProps {
  onCancel(): void
  onSubmit(): void
  isSubmitting: boolean
}
const Disclaimer = ({ onCancel, onSubmit, isSubmitting }: DisclaimerProps) => {
  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>
        Disclaimer about the release of seller contact information
      </ModalHeader>
      <ModalBody>{BuyerDisclaimerHtml}</ModalBody>
      <ModalFooter gap="3">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button
          isLoading={isSubmitting}
          colorScheme="primary"
          onClick={onSubmit}
        >
          Accept & send request
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default Disclaimer
