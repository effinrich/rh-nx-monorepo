import { Helmet } from 'react-helmet'
import { Page, ResearchHubPage } from '@redesignhealth/portal/ui'
import { getCurrentUserRole } from '@redesignhealth/portal/utils'

export const ResearchHub = () => {
  const role = getCurrentUserRole()
  const hideArticlesSupport = !role?.includes('SUPER')

  return (
    <Page>
      <Helmet>
        <title>Research Hub</title>
      </Helmet>
      <ResearchHubPage hideArticlesSupport={hideArticlesSupport} />
    </Page>
  )
}

export default ResearchHub
