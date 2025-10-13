import { useParams } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import { useRequestIpListingContactInfo } from '@redesignhealth/portal/data-assets'
import { Modal, ModalOverlay } from '@redesignhealth/ui'

import Disclaimer from './partials/disclaimer'
import Success from './partials/success'
interface BuyerRequestModalProps {
  onClose(): void
  isOpen: boolean
}
const BuyerRequestModal = ({ onClose, isOpen }: BuyerRequestModalProps) => {
  const { ipListingId } = useParams()
  const {
    mutateAsync: requestSellerInfo,
    isSuccess,
    isPending
  } = useRequestIpListingContactInfo(ipListingId)

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
            analytics.sendDisclaimerAccept({ type: 'BUYER' })
          }}
          isSubmitting={isPending}
        />
      )}
    </Modal>
  )
}

export default BuyerRequestModal
