import { Helmet } from 'react-helmet'
import { AddVendorPage, Page } from '@redesignhealth/portal/ui'

export const AddVendor = () => {
  return (
    <Page>
      <Helmet>
        <title>Vendors | Add</title>
      </Helmet>
      <AddVendorPage />
    </Page>
  )
}

export default AddVendor
