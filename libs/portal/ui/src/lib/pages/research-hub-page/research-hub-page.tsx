import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useGetActiveTab } from '@redesignhealth/portal/utils'
import {
  Box,
  SectionHeader,
  Stack,
  Tab,
  TabList,
  TabsRoot
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
    <Stack gap="6">
      <SectionHeader
        title="Research Hub"
        isDivider={false}
        rightElement={
          <AddResearchMenu hideArticlesSupport={hideArticlesSupport} />
        }
      />
      <TabsRoot index={activeTab} colorPalette="primary">
        <TabList>
          {tabs.map(tab => (
            <Tab key={tab.to} asChild>
              <RouterLink to={tab.to} replace>
                {tab.label}
              </RouterLink>
            </Tab>
          ))}
        </TabList>
        <Outlet />
      </TabsRoot>
    </Stack>
  )
}
