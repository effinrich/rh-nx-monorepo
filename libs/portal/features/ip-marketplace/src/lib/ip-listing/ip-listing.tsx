import { Helmet } from 'react-helmet'
import { IPMarketplacePage, Page } from '@redesignhealth/portal/ui'

export const IpListing = () => {
  return (
    <Page>
      <Helmet>
        <title>IP Listings</title>
      </Helmet>
      <IPMarketplacePage />
    </Page>
  )
}

export default IpListing
