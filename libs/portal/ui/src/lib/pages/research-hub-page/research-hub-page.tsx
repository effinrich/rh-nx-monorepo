import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useGetActiveTab } from '@redesignhealth/portal/utils'
import {
  Box,
  SectionHeader,
  Stack,
  TabsList,
  TabsRoot,
  TabsTrigger
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
  )
}
