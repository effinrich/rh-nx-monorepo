import {
  CompanyMemberRole,
  TabConfig,
  useSetActiveTab
} from '@redesignhealth/portal/utils'

/**
 * Handle routing to the first tab if none are selected
 */
export const useGetTabs = (companyMemberRole?: CompanyMemberRole) => {
  const tabs = getTabs(companyMemberRole)
  useSetActiveTab(tabs)
  return tabs
}

const getTabs = (companyMemberRole?: CompanyMemberRole) => {
  if (!companyMemberRole) {
    return []
  }

  const tabs: TabConfig[] = []
  tabs.push({
    label: 'IP details',
    to: 'ip-details'
  })

  if (companyMemberRole === 'MARKETPLACE_SELLER') {
    tabs.push({
      label: 'Requests',
      to: 'requests'
    })
  }

  return tabs
}
