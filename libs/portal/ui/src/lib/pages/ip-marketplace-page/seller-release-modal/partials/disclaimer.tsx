import { SellerDisclaimerHtml } from '@redesignhealth/portal/data-assets'
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner
} from '@redesignhealth/ui'

interface DisclaimerProps {
  onCancel(): void
  onSubmit(): void
  isSubmitting: boolean
}
const Disclaimer = ({ onCancel, onSubmit, isSubmitting }: DisclaimerProps) => {
  return (
    // @ts-expect-error Chakra v3 children typing
    <DialogPositioner>
      {/* @ts-expect-error Chakra v3 children typing */}
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          Disclaimer about the release of seller contact information
        </DialogHeader>
        <DialogBody>{SellerDisclaimerHtml}</DialogBody>
        <DialogFooter gap="3">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            loading={isSubmitting}
            colorPalette="primary"
            onClick={onSubmit}
          >
            Accept & release info
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPositioner>
  )
}

export default Disclaimer
