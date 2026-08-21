import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot
} from '@redesignhealth/ui'

interface SuccessConfirmationProps {
  advisorName?: string
  onClose: VoidFunction
  open: boolean
}

export const SuccessConfirmation = ({
  open,
  onClose,
  advisorName
}: SuccessConfirmationProps) => {
  return (
    <DialogRoot
      open={open}
      onOpenChange={(e: { open: boolean }) => !e.open && onClose()}
      size="xl"
    >
      <DialogBackdrop />
      {/* @ts-expect-error Chakra v3 DialogPositioner children typing */}
      <DialogPositioner>
        {/* @ts-expect-error Chakra v3 DialogContent children typing */}
        <DialogContent>
          <DialogHeader>Successful Request</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            Your request for {advisorName ?? 'the advisor'} has been submitted.
          </DialogBody>
          <DialogFooter>
            <Button colorPalette="blue" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
