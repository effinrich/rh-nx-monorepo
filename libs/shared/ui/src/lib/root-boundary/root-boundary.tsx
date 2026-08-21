import { useEffect } from 'react'
import { useLocation, useNavigate, useRouteError } from 'react-router-dom'

import { ErrorFallback } from './error-fallback'
import type { ErrorFallbackProps } from './error-fallback-props'

export function RootBoundary({
  logout
}: {
  logout?: (cb: () => void) => void
}) {
  const error = useRouteError() as ErrorFallbackProps['error']
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (error.response?.status === 401 || error.status === 401) {
      logout?.(() => {
        navigate('/sign-in', { state: { from: location }, replace: true })
      })
    }
  }, [logout, error.response?.status, error.status, navigate, location])

  return <ErrorFallback error={error} />
}

export default RootBoundary
export type { ErrorFallbackProps } from './error-fallback-props'
