import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  RoleAuthorityEnum,
  useGetCompanies,
  useGetUserInfo,
  useGetUsersList
  // useGetUsersList
} from '@redesignhealth/portal/data-assets'
import { Page } from '@redesignhealth/portal/ui'
import { isAdminRole } from '@redesignhealth/portal/utils'
import {
  AddUserIcon,
  Box,
  CtaCard,
  SectionHeader,
  SimpleGrid,
  StatCard
} from '@redesignhealth/ui'

import CompanyCtaCard from './partials/company-cta-card'

export const Dashboard = () => {
  const { data: userInfo } = useGetUserInfo()
  const { data: companies } = useGetCompanies()
  const navigate = useNavigate()
  const { data: users } = useGetUsersList(0, 0)

  useEffect(() => {
    if (!userInfo) {
      return
    }
    if (!companies) {
      return
    }
    if (userInfo.role?.authority !== RoleAuthorityEnum.OpCoUser) {
      return
    }
    if (companies.content.length === 0) {
      navigate('/library')
    }
    navigate(`/companies/${companies.content[0].id}/overview`)
  }, [companies, navigate, userInfo])
  /* TODO: move isCurrentUserAdmin to Zustand when the time comes */
  const isCurrentUserAdmin =
    userInfo?.roles?.some(role => isAdminRole(role.authority)) ?? false

  if (!userInfo) return null

  return (
    <Page>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <SectionHeader title="Welcome" firstName={userInfo?.givenName ?? ''} />

      <Box mt={{ base: '20px', md: '60px' }}>
        <SimpleGrid columns={[1, 1, 2, 2]} spacing="5">
          {isCurrentUserAdmin && (
            <>
              <StatCard
                title="Total Companies"
                stat={companies?.page.totalElements}
                to="/companies"
                data-id="companies-stats"
              />
              <StatCard
                title="Total Users"
                stat={users?.page.totalElements}
                to="/users"
                data-id="users-stats"
              />
            </>
          )}
          <CompanyCtaCard
            companiesExist={companies && companies.content.length > 0}
            isCurrentUserAdmin={isCurrentUserAdmin}
          />
          {isCurrentUserAdmin && (
            <CtaCard
              title="Add and assign users to existing companies"
              ctaText="Add user"
              to="/add-user"
              boxShadow="none"
              borderWidth={0}
              icon={AddUserIcon}
              data-testid="users-cta"
            />
          )}
        </SimpleGrid>
        <Outlet />
      </Box>
    </Page>
  )
}
