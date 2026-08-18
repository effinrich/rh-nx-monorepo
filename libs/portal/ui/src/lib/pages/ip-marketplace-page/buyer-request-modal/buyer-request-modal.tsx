import { useParams } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import { useRequestIpListingContactInfo } from '@redesignhealth/portal/data-assets'
import { DialogBackdrop, DialogRoot } from '@redesignhealth/ui'

import Disclaimer from './partials/disclaimer'
import Success from './partials/success'
interface BuyerRequestModalProps {
  onClose(): void
  open: boolean
}
const BuyerRequestModal = ({ onClose, open }: BuyerRequestModalProps) => {
  const { ipListingId } = useParams()
  const {
    mutateAsync: requestSellerInfo,
    isSuccess,
    isPending
  } = useRequestIpListingContactInfo(ipListingId)

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e: { open: boolean }) => {
        if (!e.open) onClose()
      }}
      size="xl"
    >
      <DialogBackdrop />
      {isSuccess ? (
        <Success onConfirmation={onClose} />
      ) : (
        <Disclaimer
          onCancel={onClose}
          onSubmit={async () => {
            await requestSellerInfo()
            analytics.sendDisclaimerAccept({ type: 'BUYER' })
          }}
          isSubmitting={isPending}
        />
      )}
    </DialogRoot>
  )
}

export default BuyerRequestModal
