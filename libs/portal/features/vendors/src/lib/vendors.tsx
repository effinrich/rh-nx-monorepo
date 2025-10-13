import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'
import { Page, VendorReferencesPage } from '@redesignhealth/portal/ui'

export const Vendors = () => {
  return (
    <Page>
      <Helmet>
        <title>Vendor References</title>
      </Helmet>
      <VendorReferencesPage />
      <Outlet />
    </Page>
  )
}

export default Vendors
