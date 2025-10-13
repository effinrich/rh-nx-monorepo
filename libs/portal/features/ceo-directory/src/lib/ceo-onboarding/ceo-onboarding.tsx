import { Helmet } from 'react-helmet'
import { CeoDirectoryOnboardingPage, Page } from '@redesignhealth/portal/ui'

export const CeoOnboarding = () => {
  return (
    <Page>
      <Helmet>
        <title>CEO Directory - Onboarding</title>
      </Helmet>
      <CeoDirectoryOnboardingPage />
    </Page>
  )
}

export default CeoOnboarding
