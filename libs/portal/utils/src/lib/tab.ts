import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface TabConfig {
  // display name for tab
  label: string
  // react-router location
  to: string
}

export const useSetActiveTab = (tabs: TabConfig[]) => {
  const activeTab = useGetActiveTab(tabs)
  const navigate = useNavigate()
  useEffect(() => {
    if (tabs.length > 0 && activeTab === -1) {
      // replace: true is used to prevent us from getting into an
      // lock of clicking "back" and being redirected to the
      // first tab over and over.
      navigate(tabs[0].to, { replace: true })
    }
  }, [activeTab, navigate, tabs])
}

export const useGetActiveTab = (tabs: TabConfig[]) => {
  const { pathname } = useLocation()
  return getActiveTab(tabs, pathname)
}

const getActiveTab = (tabs: TabConfig[], pathname: string) => {
  return tabs.findIndex(({ to }) => pathname?.includes(to))
}
