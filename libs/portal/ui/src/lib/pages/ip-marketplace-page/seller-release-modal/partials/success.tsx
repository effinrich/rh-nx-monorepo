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
        <DialogHeader>Information released successfully</DialogHeader>
        <DialogBody>
          Your contact information was emailed to the interested buyer.
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
