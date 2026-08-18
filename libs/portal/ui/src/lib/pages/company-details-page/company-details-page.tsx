import { Link as RouterLink, Outlet, useParams } from 'react-router-dom'
import { useGetCompanyById } from '@redesignhealth/portal/data-assets'
import { useGetActiveTab } from '@redesignhealth/portal/utils'
import {
  Loader,
  Stack,
  TabsList,
  TabsRoot,
  TabsTrigger
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
    <Stack gap={6}>
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
      <TabsRoot value={tabs[activeTab]?.to} colorPalette="primary">
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.to} value={tab.to} asChild>
              <RouterLink to={tab.to} replace>
                {tab.label}
              </RouterLink>
            </TabsTrigger>
          ))}
        </TabsList>
        <Outlet />
      </TabsRoot>
    </Stack>
  ) : (
    <Loader />
  )
}

export default CompanyDetailsPage
