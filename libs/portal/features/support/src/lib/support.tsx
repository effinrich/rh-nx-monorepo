import { Helmet } from 'react-helmet'
import { Page, SupportPage } from '@redesignhealth/portal/ui'

export const Support = () => {
  return (
    <Page>
      <Helmet>
        <title>Support</title>
      </Helmet>
      <SupportPage />
    </Page>
  )
}
export default Support
