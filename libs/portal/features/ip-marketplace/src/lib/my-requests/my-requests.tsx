import { Helmet } from 'react-helmet'
import { MyRequestsPage, Page } from '@redesignhealth/portal/ui'

export const MyRequests = () => {
  return (
    <Page>
      <Helmet>
        <title>My Requests</title>
      </Helmet>
      <MyRequestsPage />
    </Page>
  )
}

export default MyRequests
