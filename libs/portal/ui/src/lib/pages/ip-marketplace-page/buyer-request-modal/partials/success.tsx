import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner
} from '@redesignhealth/ui'

interface SuccessProps {
  onConfirmation(): void
}

const Success = ({ onConfirmation }: SuccessProps) => {
  return (
    // @ts-expect-error Chakra v3 children typing
    <DialogPositioner>
      {/* @ts-expect-error Chakra v3 children typing */}
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>Request sent successfully</DialogHeader>
        <DialogBody>
          We'll email you when the seller releases their contact information to
          you.
        </DialogBody>
        <DialogFooter>
          <Button colorPalette="primary" onClick={onConfirmation}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPositioner>
  )
}

export default Success
