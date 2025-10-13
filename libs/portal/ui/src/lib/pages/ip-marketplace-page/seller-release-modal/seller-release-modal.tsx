import analytics from '@redesignhealth/analytics'
import { useRequestIpListingContactInfo } from '@redesignhealth/portal/data-assets'
import { Modal, ModalOverlay } from '@redesignhealth/ui'

import Disclaimer from './partials/disclaimer'
import Success from './partials/success'
interface SellerReleaseModalProps {
  onClose(): void
  isOpen: boolean
  buyerEmail?: string
  ipListingId?: string
}

const SellerReleaseModal = ({
  onClose,
  isOpen,
  buyerEmail,
  ipListingId
}: SellerReleaseModalProps) => {
  const {
    mutateAsync: requestSellerInfo,
    isSuccess,
    isPending
  } = useRequestIpListingContactInfo(ipListingId, buyerEmail)

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="xl">
      <ModalOverlay />
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
    </Modal>
  )
}

export default SellerReleaseModal
