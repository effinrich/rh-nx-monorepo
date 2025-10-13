import { Link as RouterLink, Outlet, useParams } from 'react-router-dom'
import { useGetCompanyById } from '@redesignhealth/portal/data-assets'
import { useGetActiveTab } from '@redesignhealth/portal/utils'
import {
  Loader,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs
} from '@redesignhealth/ui'

import BackButton from '../../back-button/back-button'

import CompanyHeader from './partials/company-header'
import MarketplaceHeader from './partials/marketplace-header'
import { useGetTabs } from './util'

const CompanyDetailsPage = () => {
  const { companyId } = useParams()
  const { data: company } = useGetCompanyById(companyId)

  const tabs = useGetTabs(company)
  const activeTab = useGetActiveTab(tabs)

  return company ? (
    <Stack spacing={6}>
      <BackButton to="/companies">Back to companies</BackButton>
      {company.isMarketplaceCompany ? (
        <MarketplaceHeader
          companyName={company.name}
          activityType={company.activityType?.displayName}
        />
      ) : (
        <CompanyHeader
          companyId={company.id}
          companyName={company.name}
          status={company.status}
          number={company.number}
        />
      )}
      <Tabs index={activeTab} colorScheme="primary">
        <TabList>
          {tabs.map(tab => (
            <Tab key={tab.to} as={RouterLink} to={tab.to} replace>
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <Outlet />
        </TabPanels>
      </Tabs>
    </Stack>
  ) : (
    <Loader />
  )
}

export default CompanyDetailsPage
