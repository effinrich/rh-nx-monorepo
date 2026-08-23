import { BuyerDisclaimerHtml } from '@redesignhealth/portal/data-assets'
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogTitle
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
          {/* @ts-expect-error Chakra v3 DialogTitle children typing */}
          <DialogTitle>
            Disclaimer about the release of seller contact information
          </DialogTitle>
        </DialogHeader>
        <DialogBody>{BuyerDisclaimerHtml}</DialogBody>
        <DialogFooter gap="3">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            loading={isSubmitting}
            colorPalette="primary"
            onClick={onSubmit}
          >
            Accept & send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPositioner>
  )
}

export default Disclaimer
