import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import {
  useGetCompanies,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { MobileNav, Nav, TermsChecker } from '@redesignhealth/portal/ui'
import {
  getImpersonatedEmail,
  SCROLL_CONTAINER_ID,
  setCurrentUserRole
} from '@redesignhealth/portal/utils'
import { Box, Loader } from '@redesignhealth/ui'

import ImpersonateBanner from './partials/impersonate-banner'

interface GA4CustomUserProps {
  user_role?: string
  user_membership?: string
}

export const Layout = () => {
  const { data: userInfo } = useGetUserInfo()
  const { data: companies } = useGetCompanies()
  const impersonatedEmail = getImpersonatedEmail()
  const [userCompanyId, setUserCompanyId] = useState<string | undefined>()

  useEffect(() => {
    if (!userInfo) {
      return
    }
    const firstRole = userInfo.roles?.[0]
    if (firstRole) {
      setCurrentUserRole(firstRole.authority)
    }

    const newUserProps: GA4CustomUserProps = {}
    if (firstRole) {
      newUserProps.user_role = firstRole.displayName
    }
    if (userInfo.memberOf && userInfo.memberOf.length > 0) {
      newUserProps.user_membership = userInfo.memberOf[0].name
    }
    analytics.setUserProperties(newUserProps)
  }, [userInfo])

  useEffect(() => {
    if (companies?.content && companies.content.length > 0) {
      setUserCompanyId(companies.content[0].id)
    }
  }, [companies])

  if (!userInfo) return <Loader />

  return (
    <TermsChecker>
      <Box h={{ lg: '100vh' }}>
        {impersonatedEmail && <ImpersonateBanner userInfo={userInfo} />}
        <MobileNav userInfo={userInfo} />
        <Box h={{ lg: '100%' }} display={{ lg: 'flex' }}>
          <Box display={{ base: 'none', lg: 'block' }}>
            <Nav userInfo={userInfo} userCompanyId={userCompanyId} />
          </Box>
          <Box
            id={SCROLL_CONTAINER_ID}
            h={{ lg: '100%' }}
            w={{ lg: '100%' }}
            overflowY={{ lg: 'scroll' }}
            p={['24px', '32px']}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </TermsChecker>
  )
}
