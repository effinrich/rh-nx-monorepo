import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUserQuery } from '@redesignhealth/third-party-network/features/authentication'
import { removeUserAccessToken } from '@redesignhealth/third-party-network/utils'
import { Container, Loader } from '@redesignhealth/ui'

import { AvatarMenu } from './components/avatar-menu'

export const RootLayout = () => {
  const { isPending, isError, isSuccess } = useCurrentUserQuery()
  const { pathname, state } = useLocation()

  const isLoginCurrentPage = pathname === '/login'

  if (isPending && !isLoginCurrentPage) return <Loader size="lg" />

  if (isError && !isLoginCurrentPage) {
    removeUserAccessToken()
    return <Navigate to="/login" state={{ redirect: pathname }} />
  }

  if (isSuccess && isLoginCurrentPage) {
    return <Navigate to={state?.redirect ?? '/'} state={null} />
  }

  return (
    <Container py="8" px="16" maxW="container.xl">
      {!isLoginCurrentPage && <AvatarMenu />}
      <Outlet />
    </Container>
  )
}
