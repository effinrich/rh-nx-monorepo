import { Helmet } from 'react-helmet'
import {
  BackButton,
  EditCompanyVendorPage,
  Page
} from '@redesignhealth/portal/ui'
import { Box } from '@redesignhealth/ui'

export const EditCompanyVendor = () => {
  return (
    <Page>
      <Helmet>
        <title>Company vendors | Edit</title>
      </Helmet>
      <BackButton>Back to vendors</BackButton>
      <Box mt={6}>
        <EditCompanyVendorPage />
      </Box>
    </Page>
  )
}

export default EditCompanyVendor
