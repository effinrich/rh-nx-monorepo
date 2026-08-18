import analytics from '@redesignhealth/analytics'
import { useRequestIpListingContactInfo } from '@redesignhealth/portal/data-assets'
import { DialogBackdrop, DialogRoot } from '@redesignhealth/ui'

import Disclaimer from './partials/disclaimer'
import Success from './partials/success'
interface SellerReleaseModalProps {
  onClose(): void
  open: boolean
  buyerEmail?: string
  ipListingId?: string
}

const SellerReleaseModal = ({
  onClose,
  open,
  buyerEmail,
  ipListingId
}: SellerReleaseModalProps) => {
  const {
    mutateAsync: requestSellerInfo,
    isSuccess,
    isPending
  } = useRequestIpListingContactInfo(ipListingId, buyerEmail)

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
            analytics.sendDisclaimerAccept({ type: 'SELLER' })
          }}
          isSubmitting={isPending}
        />
      )}
    </DialogRoot>
  )
}

export default SellerReleaseModal
