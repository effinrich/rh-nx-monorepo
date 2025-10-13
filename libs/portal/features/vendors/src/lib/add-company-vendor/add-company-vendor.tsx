import { Helmet } from 'react-helmet'
import {
  AddCompanyVendorPage,
  BackButton,
  Page
} from '@redesignhealth/portal/ui'
import { Box } from '@redesignhealth/ui'

export const AddCompanyVendor = () => {
  return (
    <Page>
      <Helmet>
        <title>Company vendors | Add</title>
      </Helmet>
      <BackButton>Back to vendors</BackButton>
      <Box mt={6}>
        <AddCompanyVendorPage />
      </Box>
    </Page>
  )
}

export default AddCompanyVendor
