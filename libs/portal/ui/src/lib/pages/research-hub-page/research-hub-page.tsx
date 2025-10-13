import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useGetActiveTab } from '@redesignhealth/portal/utils'
import {
  Box,
  SectionHeader,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs
} from '@redesignhealth/ui'

import { AddResearchMenu } from './add-research-menu/add-research-menu'
import { useGetTabs } from './utils/tabs'
export interface ResearchHubPageProps {
  hideArticlesSupport?: boolean
}

export const ResearchHubPage = ({
  hideArticlesSupport
}: ResearchHubPageProps) => {
  const tabs = useGetTabs(hideArticlesSupport)
  const activeTab = useGetActiveTab(tabs)
  return (
    <Stack spacing="6">
      <SectionHeader
        title="Research Hub"
        isDivider={false}
        rightElement={
          <AddResearchMenu hideArticlesSupport={hideArticlesSupport} />
        }
      />
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
  )
}
