import { CompanySummary } from '@redesignhealth/portal/data-assets'
import { TabConfig, useSetActiveTab } from '@redesignhealth/portal/utils'

/**
 * Handle routing to the first tab if none are selected
 */
export const useGetTabs = (company?: CompanySummary) => {
  const tabs = getTabs(company)
  useSetActiveTab(tabs)
  return tabs
}

const getTabs = (company?: CompanySummary) => {
  const PORTAL_ENV = import.meta.env.VITE_PORTAL_ENV
  if (!company) {
    return []
  }

  const tabs: TabConfig[] = []
  if (!company.activityType) {
    tabs.push({
      label: 'Overview',
      to: 'overview'
    })
  }
  if (company.activityType?.value === 'ENTERPRISE_SELLER') {
    tabs.push({
      label: 'All IP',
      to: 'all-ip'
    })
  }

  tabs.push({
    label: 'Users',
    to: 'users'
  })

  if (company.stage === 'OP_CO') {
    tabs.push({ to: 'infrastructure', label: 'Infrastructure' })
    if (PORTAL_ENV !== 'prod') {
      tabs.push({ to: 'vendors', label: 'Vendors' })
      tabs.push({
        label: 'Expert Network',
        to: 'expert-network'
      })
    }
  }

  return tabs
}
