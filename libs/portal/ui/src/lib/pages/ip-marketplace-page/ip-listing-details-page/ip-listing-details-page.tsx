import { Link as RouterLink, Outlet, useParams } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import {
  IpExpansion,
  useGetIpListing,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import {
  CompanyMemberRole,
  getCompanyMemberRole,
  useGetActiveTab
} from '@redesignhealth/portal/utils'
import {
  Box,
  Loader,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  useDisclosure
} from '@redesignhealth/ui'

import DetailsCard from '../../../details-card/details-card'
import DetailsCardHeader from '../../../details-card/details-card-header'
import BuyerRequestModal from '../buyer-request-modal/buyer-request-modal'
import Metrics from '../partials/metrics'

import BuyerRequestButton from './partials/buyer-request-button'
import { useGetTabs } from './util'

const determineExpansions = (
  companyMemberRole: CompanyMemberRole
): IpExpansion[] => {
  const expansions: IpExpansion[] = ['requests']
  if (companyMemberRole === 'MARKETPLACE_SELLER') {
    expansions.push('metrics')
  }
  return expansions
}

const IpListingDetailsPage = () => {
  const { ipListingId } = useParams()
  const { data: currentUser } = useGetUserInfo()
  const companyRole = getCompanyMemberRole(currentUser?.memberOf)
  const { data: ipListing } = useGetIpListing(
    ipListingId,
    determineExpansions(companyRole)
  )
  const tabs = useGetTabs(companyRole)
  const activeTab = useGetActiveTab(tabs)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!ipListing) {
    return <Loader />
  }

  return (
    <Box>
      <DetailsCard gap={6}>
        <DetailsCardHeader
          title={ipListing?.name}
          backButtonText="Back to marketplace"
          subtitle={
            ipListing.metrics && (
              <Metrics
                viewCount={ipListing.metrics.viewCount}
                requestCount={ipListing.metrics.requestCount}
              />
            )
          }
          rightAddon={
            companyRole === 'MARKETPLACE_BUYER' && (
              <BuyerRequestButton
                hasRequestedInfo={!!ipListing.requestContactInfo?.length}
                onClick={() => {
                  analytics.sendSelectContentEvent({
                    content_type: 'IP Listing Request',
                    content_id: ipListing.id
                  })
                  onOpen()
                }}
              />
            )
          }
        />
        <Tabs index={activeTab} colorScheme="primary">
          <TabList>
            {tabs.length > 1 &&
              tabs.map(tab => (
                <Tab key={tab.to} as={RouterLink} to={tab.to} replace>
                  {tab.label}
                </Tab>
              ))}
          </TabList>
          <TabPanels>
            <Outlet />
          </TabPanels>
        </Tabs>
      </DetailsCard>
      <BuyerRequestModal onClose={onClose} isOpen={isOpen} />
    </Box>
  )
}

export default IpListingDetailsPage
