import { TabConfig, useSetActiveTab } from '@redesignhealth/portal/utils'

export const useGetTabs = (hideArticleSupport?: boolean) => {
  const tabs = getTabs(hideArticleSupport)
  useSetActiveTab(tabs)
  return tabs
}

const getTabs = (hideArticleSupport?: boolean) => {
  const tabs: TabConfig[] = []
  tabs.push({ to: 'research-sprints', label: 'Research reports' })
  tabs.push({ to: 'call-notes', label: 'Call notes' })
  if (!hideArticleSupport) {
    tabs.push({ to: 'external-content', label: 'External content' })
  }

  return tabs
}
