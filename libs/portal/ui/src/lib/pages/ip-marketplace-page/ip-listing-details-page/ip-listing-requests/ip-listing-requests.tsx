import { useParams } from 'react-router-dom'
import { useGetIpListing } from '@redesignhealth/portal/data-assets'
import { Loader, Stack } from '@redesignhealth/ui'

import IPCard from '../../ip-card/ip-card'
import { BuyerSellerDetailsReleaseView } from '../../partials/buyer-seller-details-release-view'
import { DetailsOfRequestReleaseView } from '../../partials/details-of-request-release-view'
import { SellerReleaseAction } from '../../partials/seller-release-action'

const IpListingRequests = () => {
  const { ipListingId } = useParams()
  const { data } = useGetIpListing(ipListingId, ['requests'])

  if (!data) {
    return <Loader />
  }
  return (
    <Stack gap="6">
      {data.requestContactInfo?.map((request, index) => (
        <IPCard
          key={request.dateRequest + index}
          id={request.dateRequest + index}
          buyerAddOn={
            <BuyerSellerDetailsReleaseView
              buyerSeller={request.buyerInfo}
              releasedDate={request.dateRelease}
            />
          }
          detailsOfRequestAddOn={
            <DetailsOfRequestReleaseView
              dateRequest={request.dateRequest}
              dateRelease={request.dateRelease}
            />
          }
          detailsOfRequestRightElement={
            <SellerReleaseAction
              dateRelease={request.dateRelease}
              buyerEmail={request.buyerInfo.email}
              ipListingId={ipListingId}
            />
          }
        />
      ))}
    </Stack>
  )
}

export default IpListingRequests
