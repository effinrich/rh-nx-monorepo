import { Helmet } from 'react-helmet'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useGetUsersList } from '@redesignhealth/portal/data-assets'
import { Page, UsersTable } from '@redesignhealth/portal/ui'
import {
  getCurrentUserRole,
  isSuperAdminRole,
  setImpersonatedEmail
} from '@redesignhealth/portal/utils'
import { Button, Loader, SectionHeader } from '@redesignhealth/ui'
import { useQueryClient } from '@tanstack/react-query'

export const Users = () => {
  const navigate = useNavigate()
  const { data: users } = useGetUsersList(0, 500, ['memberOf'])
  const role = getCurrentUserRole()
  const isSuperAdmin = Boolean(role && isSuperAdminRole(role))
  const queryClient = useQueryClient()
  const handleImpersonatedEmail = (user: { email: string }) => {
    setImpersonatedEmail(user.email)
    queryClient.clear()
    navigate(0)
  }

  const usersTableData =
    users?.content.map(user => ({
      pictureSrc: '',
      name: `${user.givenName} ${user.familyName}`,
      email: user.email,
      userType: user.roles?.at(0)?.displayName ?? '',
      dateAdded: user.created ?? '',
      companyName: user.memberOf?.at(0)?.name ?? '',
      companies:
        user.memberOf?.sort(
          (a, b) => a.name?.localeCompare(b.name || '') || 0
        ) ?? []
    })) ?? []

  return (
    <Page>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <SectionHeader
        title="Users"
        helpText="Manage users and their account permissions here."
        rightElement={
          <Button as={Link} to="add-user" colorScheme="primary" role="button">
            Add user
          </Button>
        }
      />
      {users ? (
        <UsersTable
          isSuperAdmin={isSuperAdmin}
          usersTableData={usersTableData}
          totalUsers={usersTableData.length}
          onClickEditUser={email => navigate(`edit-user/${email}`)}
          handleImpersonatedEmail={handleImpersonatedEmail}
        />
      ) : (
        <Loader />
      )}
      <Outlet />
    </Page>
  )
}
