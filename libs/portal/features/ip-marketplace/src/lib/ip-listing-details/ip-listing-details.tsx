import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { useGetIpListing } from '@redesignhealth/portal/data-assets'
import { IpListingDetailsPage, Page } from '@redesignhealth/portal/ui'
import { Loader } from '@redesignhealth/ui'

const IpListingDetails = () => {
  const { ipListingId } = useParams()
  const { data: ipListing } = useGetIpListing(ipListingId)

  return (
    <Page>
      {ipListing && (
        <Helmet>
          <title>IP Listing Details: {ipListing.name}</title>
        </Helmet>
      )}
      {!ipListing ? <Loader /> : <IpListingDetailsPage />}
    </Page>
  )
}

export default IpListingDetails
