import analytics from '@redesignhealth/analytics'
import { Button, useDisclosure } from '@redesignhealth/ui'

import SellerReleaseModal from '../seller-release-modal/seller-release-modal'
interface SellerReleaseActionProps {
  dateRelease?: string
  buyerEmail?: string
  ipListingId?: string
}

export const SellerReleaseAction = ({
  dateRelease,
  buyerEmail,
  ipListingId
}: SellerReleaseActionProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      {!dateRelease && (
        <Button
          colorScheme="primary"
          variant="solid"
          width={['100%', '100%', 'initial']}
          onClick={() => {
            analytics.sendSelectContentEvent({
              content_type: 'IP Listing Release',
              content_id: ipListingId || 'UNKNOWN'
            })
            onOpen()
          }}
        >
          Release info
        </Button>
      )}
      <SellerReleaseModal
        isOpen={isOpen}
        onClose={onClose}
        buyerEmail={buyerEmail}
        ipListingId={ipListingId}
      />
    </>
  )
}
